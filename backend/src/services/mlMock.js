export const analyzeReportMock = () => ({
  values: [
    { name: 'Hemoglobin', value: '10.2 g/dL', status: 'low', normal: '12-16 g/dL', note: 'Slightly low. Discuss iron intake with your doctor.' },
    { name: 'Blood Glucose (Fasting)', value: '92 mg/dL', status: 'normal', normal: '70-100 mg/dL', note: 'Within normal range.' },
    { name: 'Platelet Count', value: '180,000 /uL', status: 'normal', normal: '150,000-400,000 /uL', note: 'Normal.' },
    { name: 'TSH', value: '3.8 mIU/L', status: 'borderline', normal: '0.5-2.5 mIU/L (pregnancy)', note: 'Slightly elevated for pregnancy. Monitor.' },
    { name: 'Blood Pressure', value: '128/84 mmHg', status: 'borderline', normal: '<120/80 mmHg', note: 'Slightly elevated. Track regularly.' },
    { name: 'Urine Protein', value: 'Negative', status: 'normal', normal: 'Negative', note: 'Normal.' }
  ],
  summary: 'Mild anemia and slightly elevated TSH. Recommend follow-up with your OB-GYN.'
});

export const dietPlanMock = (trimester = 2) => ({
  trimester,
  focus: 'Balanced nutrition with iron, calcium, and folate',
  meals: {
    breakfast: ['Oats with almonds', 'Boiled egg', 'Seasonal fruit'],
    lunch: ['Brown rice', 'Dal', 'Leafy greens'],
    snacks: ['Yogurt', 'Handful of nuts'],
    dinner: ['Grilled paneer/chicken', 'Mixed veggies', 'Whole wheat roti']
  }
});

export const symptomAdviceMock = (symptoms = []) => ({
  symptoms,
  advice: [
    'Stay hydrated and rest frequently.',
    'Light stretching can help with back pain.',
    'If symptoms worsen or include bleeding, contact your doctor immediately.'
  ],
  shouldConsultDoctor: symptoms.includes('bleeding') || symptoms.includes('severe pain')
});
