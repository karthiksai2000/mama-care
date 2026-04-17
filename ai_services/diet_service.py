import random
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

random.seed(42)
np.random.seed(42)

ACTIVITY_LEVELS = ["Sedentary", "Light", "Moderate", "Active"]
DIABETES_CHOICES = ["Yes", "No"]
HYPERTENSION_CHOICES = ["Yes", "No"]
DIET_PLANS = ["Balanced", "Low-Carb", "Low-Fat", "High-Protein", "Keto"]

PREGNANCY_FOODS = {
    "Balanced": [
        "Leafy greens (spinach, kale)",
        "Lentils and beans",
        "Greek yogurt",
        "Salmon (low mercury)",
        "Fortified whole grains",
    ],
    "Low-Carb": [
        "Non-starchy vegetables",
        "Eggs",
        "Avocado",
        "Nuts and seeds",
        "Low-mercury fish",
    ],
    "Low-Fat": [
        "Fruits and vegetables",
        "Lean chicken or turkey",
        "Whole grains",
        "Low-fat dairy",
        "Legumes",
    ],
    "High-Protein": [
        "Lean meats",
        "Eggs",
        "Cottage cheese",
        "Tofu",
        "Chickpeas",
    ],
    "Keto": [
        "Avocado",
        "Eggs",
        "Leafy greens",
        "Olive oil",
        "Cheese (pasteurized)",
    ],
}


def assign_diet_plan(age, bmi, activity, diabetes, hypertension, noise_scale=0.25):
    activity = str(activity).strip().capitalize()
    diabetes = "Yes" if str(diabetes).lower() in ("true", "yes", "y", "1") else "No"
    hypertension = "Yes" if str(hypertension).lower() in ("true", "yes", "y", "1") else "No"

    scores = {plan: 0.0 for plan in DIET_PLANS}

    if diabetes == "Yes":
        scores["Low-Carb"] += 2.0
        scores["Keto"] += 1.5
        scores["Low-Fat"] += 0.5

    if hypertension == "Yes":
        scores["Low-Fat"] += 2.0
        scores["Balanced"] += 0.5

    if activity == "Active":
        scores["High-Protein"] += 2.0
        scores["Balanced"] += 0.5
    elif activity == "Moderate":
        scores["Balanced"] += 1.0
        scores["High-Protein"] += 0.8
    elif activity == "Light":
        scores["Balanced"] += 0.5
    elif activity == "Sedentary":
        scores["Balanced"] += 0.2

    if bmi >= 30:
        scores["Low-Carb"] += 1.5
        scores["Low-Fat"] += 1.0
        scores["Keto"] += 0.6
    elif 25 <= bmi < 30:
        scores["Low-Carb"] += 1.0
        scores["Balanced"] += 0.5
    elif 18.5 <= bmi < 25:
        scores["Balanced"] += 1.0
    else:
        scores["High-Protein"] += 2.0

    if age >= 60:
        scores["Balanced"] += 1.0
    elif age < 25:
        scores["High-Protein"] += 0.5

    for key in scores:
        scores[key] += random.gauss(0, noise_scale)

    selected = max(scores.items(), key=lambda x: x[1])[0]
    return selected


def generate_dataset(n_rows=5000):
    rows = []
    for _ in range(n_rows):
        age = random.randint(18, 75)
        bmi = round(random.uniform(16, 40), 1)
        activity = random.choice(ACTIVITY_LEVELS)
        diabetes = random.choices(DIABETES_CHOICES, weights=[0.12, 0.88])[0]
        hypertension = random.choices(HYPERTENSION_CHOICES, weights=[0.18, 0.82])[0]
        diet = assign_diet_plan(age, bmi, activity, diabetes, hypertension)
        rows.append({
            "Age": age,
            "BMI": bmi,
            "ActivityLevel": activity,
            "Diabetes": diabetes,
            "Hypertension": hypertension,
            "DietPlan": diet,
        })
    return pd.DataFrame(rows)


def normalize_activity_input(value):
    if value is None:
        return None
    text = str(value).strip().lower()
    for activity in ACTIVITY_LEVELS:
        if text == activity.lower() or text == activity.lower().replace("-", " "):
            return activity
    if text.startswith("s"):
        return "Sedentary"
    if text.startswith("l"):
        return "Light"
    if text.startswith("m"):
        return "Moderate"
    if text.startswith("a"):
        return "Active"
    return None


def normalize_bool_to_yesno(value):
    if isinstance(value, bool):
        return "Yes" if value else "No"
    text = str(value).strip().lower()
    if text in ("true", "yes", "y", "1"):
        return "Yes"
    if text in ("false", "no", "n", "0"):
        return "No"
    return "No"


def _pick(payload, keys):
    for key in keys:
        if key in payload and payload[key] is not None:
            return payload[key]
    return None


_dataset = generate_dataset(n_rows=5000)

X = _dataset.drop("DietPlan", axis=1)
y = _dataset["DietPlan"]

_le_activity = LabelEncoder().fit(X["ActivityLevel"])
_le_diabetes = LabelEncoder().fit(X["Diabetes"])
_le_hypertension = LabelEncoder().fit(X["Hypertension"])

X_enc = X.copy()
X_enc["ActivityLevel"] = _le_activity.transform(X_enc["ActivityLevel"])
X_enc["Diabetes"] = _le_diabetes.transform(X_enc["Diabetes"])
X_enc["Hypertension"] = _le_hypertension.transform(X_enc["Hypertension"])

X_train, X_test, y_train, y_test = train_test_split(
    X_enc, y, test_size=0.2, random_state=42, stratify=y
)

_model = RandomForestClassifier(n_estimators=200, random_state=42)
_model.fit(X_train, y_train)

y_pred = _model.predict(X_test)
_accuracy = accuracy_score(y_test, y_pred)
_report = classification_report(y_test, y_pred, output_dict=True)


def predict_diet(payload):
    age = _pick(payload, ["Age", "age"])
    bmi = _pick(payload, ["BMI", "bmi"])
    activity_raw = _pick(payload, ["ActivityLevel", "activityLevel", "activity"])
    diabetes_raw = _pick(payload, ["Diabetes", "diabetes"])
    hypertension_raw = _pick(payload, ["Hypertension", "hypertension"])

    if age is None or bmi is None or activity_raw is None:
        raise ValueError("Age, BMI, and ActivityLevel are required.")

    try:
        age = int(age)
        bmi = float(bmi)
    except Exception as exc:
        raise ValueError("Age must be integer and BMI must be numeric.") from exc

    activity = normalize_activity_input(activity_raw)
    if activity is None:
        raise ValueError(f"ActivityLevel must be one of {ACTIVITY_LEVELS}.")

    diabetes = normalize_bool_to_yesno(diabetes_raw)
    hypertension = normalize_bool_to_yesno(hypertension_raw)

    activity_enc = _le_activity.transform([activity])[0]
    diabetes_enc = _le_diabetes.transform([diabetes])[0]
    hypertension_enc = _le_hypertension.transform([hypertension])[0]

    input_df = pd.DataFrame([
        {
            "Age": age,
            "BMI": bmi,
            "ActivityLevel": activity_enc,
            "Diabetes": diabetes_enc,
            "Hypertension": hypertension_enc,
        }
    ])

    pred = _model.predict(input_df)[0]
    probs = _model.predict_proba(input_df)[0]
    prob_map = {cls: float(prob) for cls, prob in zip(_model.classes_, probs)}

    return {
        "RecommendedDietPlan": pred,
        "Probabilities": prob_map,
        "PregnancyFoods": PREGNANCY_FOODS.get(pred, []),
        "ModelAccuracy": round(_accuracy, 4),
        "ClassificationReport": _report,
    }
