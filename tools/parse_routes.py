import json
from pprint import pprint

def parse_location(loc):
  return [loc["lg"], loc["lt"]]


with open("message.json", "r") as f:
  data = json.load(f)

# Name
print(data["route"]["publicName"])


# Stops
stops = []
for stop in data["stops"]:
  name = stop["name"] + " Station"
  location = parse_location(stop["location"])
  stops.append([name, location])

print()
pprint(stops)


# Path
path = []
for i, leg in enumerate(data["services"][0]["legs"]):
  steps = leg["steps"]

  for j, step in enumerate(steps):
    if i == j == 0: path.append(step["stepStart"])
    path.append(step["stepEnd"])

print()
print([parse_location(loc) for loc in path])
