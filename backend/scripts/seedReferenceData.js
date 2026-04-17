import 'dotenv/config';
import mongoose from 'mongoose';
import BabyGrowth from '../src/models/BabyGrowth.js';
import Symptom from '../src/models/Symptom.js';
import DietPlan from '../src/models/DietPlan.js';
import RiskFactor from '../src/models/RiskFactor.js';

const uri = process.env.MONGODB_URI;

const babyGrowthSeed = [
  { week: 4, fruit: 'Poppy Seed', fruitName: 'Poppy Seed', length: '0.1 cm', weight: '<1 g', dev: ['Embryo implants in uterus', 'Neural tube forming', 'Heart begins to form'] },
  { week: 6, fruit: 'Lentil', fruitName: 'Lentil', length: '0.6 cm', weight: '<1 g', dev: ['Heart starts beating', 'Arm and leg buds appear', 'Brain developing rapidly'] },
  { week: 8, fruit: 'Raspberry', fruitName: 'Raspberry', length: '1.6 cm', weight: '1 g', dev: ['Fingers and toes forming', 'Eyelids developing', 'Baby starts moving'] },
  { week: 10, fruit: 'Olive', fruitName: 'Olive', length: '3.1 cm', weight: '4 g', dev: ['All organs formed', 'Bones begin to harden', 'Fingernails growing'] },
  { week: 12, fruit: 'Lime', fruitName: 'Lime', length: '5.4 cm', weight: '14 g', dev: ['Reflexes developing', 'Can open and close fists', 'Vocal cords forming'] },
  { week: 14, fruit: 'Peach', fruitName: 'Peach', length: '8.7 cm', weight: '43 g', dev: ['Can make facial expressions', 'Kidneys producing urine', 'Gender may be visible'] },
  { week: 16, fruit: 'Avocado', fruitName: 'Avocado', length: '11.6 cm', weight: '100 g', dev: ['Skeleton hardening', 'Can hear sounds', 'Eyes sensitive to light'] },
  { week: 18, fruit: 'Bell Pepper', fruitName: 'Bell Pepper', length: '14.2 cm', weight: '190 g', dev: ['You may feel first kicks', 'Fingerprints forming', 'Vernix coating skin'] },
  { week: 20, fruit: 'Banana', fruitName: 'Banana', length: '16.4 cm', weight: '300 g', dev: ['Halfway there', 'Can swallow', 'Sleep cycles beginning'] },
  { week: 22, fruit: 'Coconut', fruitName: 'Coconut', length: '19 cm', weight: '430 g', dev: ['Eyebrows visible', 'Grip is strong', 'Lungs developing'] },
  { week: 24, fruit: 'Mango', fruitName: 'Mango', length: '21 cm', weight: '600 g', dev: ['Can respond to sound', 'Taste buds developing', 'Brain growing rapidly'] },
  { week: 26, fruit: 'Lettuce Head', fruitName: 'Lettuce Head', length: '23 cm', weight: '760 g', dev: ['Eyes can open', 'Lungs producing surfactant', 'Immune system developing'] },
  { week: 28, fruit: 'Eggplant', fruitName: 'Eggplant', length: '25 cm', weight: '1 kg', dev: ['Can dream', 'Can blink', 'Baby gaining fat'] },
  { week: 30, fruit: 'Cucumber', fruitName: 'Cucumber', length: '27 cm', weight: '1.3 kg', dev: ['Brain surface wrinkling', 'Bone marrow making red blood cells', 'Strong grip reflex'] },
  { week: 32, fruit: 'Orange', fruitName: 'Orange', length: '29 cm', weight: '1.7 kg', dev: ['Practicing breathing', 'Toenails visible', 'Skin smoothing out'] },
  { week: 34, fruit: 'Cantaloupe', fruitName: 'Cantaloupe', length: '32 cm', weight: '2.1 kg', dev: ['Central nervous system maturing', 'Lungs nearly mature', 'Fat layer growing'] },
  { week: 36, fruit: 'Romaine Lettuce', fruitName: 'Romaine Lettuce', length: '34 cm', weight: '2.6 kg', dev: ['Head may engage in pelvis', 'Liver processing waste', 'Most organs ready'] },
  { week: 38, fruit: 'Mini Watermelon', fruitName: 'Mini Watermelon', length: '36 cm', weight: '3 kg', dev: ['Full term', 'Organs fully mature', 'Ready for birth'] },
  { week: 40, fruit: 'Small Pumpkin', fruitName: 'Small Pumpkin', length: '37 cm', weight: '3.4 kg', dev: ['Due date', 'Baby is fully developed', 'Could arrive any day'] },
];

const symptomSeed = [
  { key: 'headache', label: 'Severe Headache', severity: 2, category: 'Neurological' },
  { key: 'blurred_vision', label: 'Blurred Vision', severity: 3, category: 'Neurological' },
  { key: 'dizziness', label: 'Dizziness', severity: 1, category: 'Neurological' },
  { key: 'nausea', label: 'Nausea / Vomiting', severity: 1, category: 'Digestive' },
  { key: 'severe_vomiting', label: 'Severe Vomiting (cannot keep fluids)', severity: 3, category: 'Digestive' },
  { key: 'heartburn', label: 'Heartburn', severity: 0, category: 'Digestive' },
  { key: 'swelling_hands', label: 'Swelling in Hands/Face', severity: 3, category: 'Circulation' },
  { key: 'swelling_feet', label: 'Mild Foot Swelling', severity: 0, category: 'Circulation' },
  { key: 'high_bp', label: 'High Blood Pressure', severity: 3, category: 'Circulation' },
  { key: 'bleeding', label: 'Vaginal Bleeding', severity: 3, category: 'Reproductive' },
  { key: 'discharge', label: 'Unusual Discharge', severity: 2, category: 'Reproductive' },
  { key: 'cramping', label: 'Severe Cramping', severity: 3, category: 'Reproductive' },
  { key: 'mild_cramps', label: 'Mild Cramps', severity: 0, category: 'Reproductive' },
  { key: 'reduced_movement', label: 'Reduced Baby Movement', severity: 3, category: 'Baby' },
  { key: 'back_pain', label: 'Back Pain', severity: 1, category: 'Musculoskeletal' },
  { key: 'pelvic_pressure', label: 'Pelvic Pressure', severity: 1, category: 'Musculoskeletal' },
  { key: 'fever', label: 'Fever (>100.4F)', severity: 2, category: 'General' },
  { key: 'fatigue', label: 'Extreme Fatigue', severity: 1, category: 'General' },
  { key: 'shortness_breath', label: 'Shortness of Breath', severity: 2, category: 'General' },
  { key: 'painful_urination', label: 'Painful Urination', severity: 2, category: 'General' },
];

const dietPlanSeed = [
  {
    trimester: 2,
    week: 24,
    meals: [
      { time: 'Breakfast (8:00 AM)', items: ['Oatmeal with fruits', 'Boiled eggs', 'Fresh orange juice'] },
      { time: 'Mid-Morning (10:30 AM)', items: ['Greek yogurt', 'Handful of almonds', 'Banana'] },
      { time: 'Lunch (1:00 PM)', items: ['Grilled chicken salad', 'Brown rice', 'Steamed vegetables'] },
      { time: 'Dinner (7:00 PM)', items: ['Lentil soup', 'Whole wheat roti', 'Paneer curry'] },
    ],
    tips: [
      'Include calcium-rich foods for bone development',
      'Eat iron-rich leafy greens to prevent anemia',
      'Drink at least 8-10 glasses of water daily',
      'Avoid raw fish, unpasteurized dairy, and excess caffeine',
    ],
  },
];

const riskFactorSeed = [
  { key: 'prev_cs', label: 'Previous C-Section' },
  { key: 'gestational_diabetes', label: 'Gestational Diabetes' },
  { key: 'preeclampsia_hist', label: 'History of Preeclampsia' },
  { key: 'multiple_preg', label: 'Multiple Pregnancy (Twins+)' },
  { key: 'thyroid', label: 'Thyroid Disorder' },
  { key: 'anemia_hist', label: 'History of Anemia' },
];

const run = async () => {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  await mongoose.connect(uri, { autoIndex: true });

  await BabyGrowth.deleteMany({});
  await Symptom.deleteMany({});
  await DietPlan.deleteMany({});
  await RiskFactor.deleteMany({});

  await BabyGrowth.insertMany(babyGrowthSeed);
  await Symptom.insertMany(symptomSeed);
  await DietPlan.insertMany(dietPlanSeed);
  await RiskFactor.insertMany(riskFactorSeed);

  console.log('[MaMa Care] Reference data seeded.');
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error('[MaMa Care] Seed failed:', error);
  process.exit(1);
});
