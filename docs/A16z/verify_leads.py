import csv

with open('soc2_intent_leads.csv', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

high = [r for r in rows if r['intent_tier'] == 'HIGH']
med = [r for r in rows if r['intent_tier'] == 'MEDIUM']

print(f'TOTAL LEADS: {len(rows)}')
print(f'HIGH INTENT: {len(high)}')
print(f'MEDIUM INTENT: {len(med)}')
print()
print('=== HIGH INTENT LEADS ===')
for i, r in enumerate(high):
    print(f"{i+1}. {r['poster_name']} ({r['company']})")
