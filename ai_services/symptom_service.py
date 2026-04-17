SYMPTOM_SPECIALIZATION_MAP = {
    "heart": "Cardiologist",
    "chest": "Cardiologist",
    "cardiac": "Cardiologist",
    "head": "Neurologist",
    "brain": "Neurologist",
    "nerve": "Neurologist",
    "stomach": "Gastroenterologist",
    "digest": "Gastroenterologist",
    "gut": "Gastroenterologist",
    "bone": "Orthopedist",
    "joint": "Orthopedist",
    "muscle": "Orthopedist",
    "skin": "Dermatologist",
    "rash": "Dermatologist",
    "child": "Pediatrician",
    "baby": "Pediatrician",
    "kid": "Pediatrician",
    "eye": "Ophthalmologist",
    "vision": "Ophthalmologist",
    "see": "Ophthalmologist",
    "ear": "ENT Specialist",
    "nose": "ENT Specialist",
    "throat": "ENT Specialist",
    "teeth": "Dentist",
    "tooth": "Dentist",
    "mental": "Psychiatrist",
    "depress": "Psychiatrist",
    "anxiety": "Psychiatrist",
    "cancer": "Oncologist",
    "tumor": "Oncologist",
}

URGENCY_KEYWORDS = {
    "emergency": "emergency",
    "severe": "high",
    "critical": "high",
    "pain": "high",
    "bleeding": "high",
    "broken": "high",
    "fracture": "high",
    "moderate": "medium",
    "mild": "low",
    "routine": "low",
}


def _coerce_symptoms(payload):
    symptoms = payload.get("symptoms")
    if isinstance(symptoms, list):
        return " ".join(str(item) for item in symptoms)
    if symptoms is None:
        return ""
    return str(symptoms)


def analyze_symptoms(payload):
    text = _coerce_symptoms(payload).lower()
    if not text:
        return {
            "specialization": "General Physician",
            "urgency": "medium",
            "recommended_doctors": [],
            "advice": "Provide more details about your symptoms for tailored guidance.",
        }

    specialization = "General Physician"
    for keyword, spec in SYMPTOM_SPECIALIZATION_MAP.items():
        if keyword in text:
            specialization = spec
            break

    urgency = "medium"
    for keyword, level in URGENCY_KEYWORDS.items():
        if keyword in text:
            urgency = level
            break

    advice = "Please schedule an appointment with a specialist."
    if urgency == "emergency":
        advice = "This appears to be an emergency. Please seek immediate care."
    elif urgency == "high":
        advice = "Your symptoms suggest prompt medical attention."

    return {
        "specialization": specialization,
        "urgency": urgency,
        "recommended_doctors": [],
        "advice": advice,
    }
