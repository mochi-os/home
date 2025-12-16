# Mochi Home app
# Copyright Alistair Cunningham 2025

# Check if an ID looks like an entity ID (50-51 chars)
def is_entity_id(id):
    return len(id) >= 50 and len(id) <= 51

def action_icons(a):
    """Return list of app icons for the home screen"""
    all_icons = mochi.app.icons()
    icons = []
    development = []
    for icon in all_icons:
        if is_entity_id(icon["id"]):
            icons.append(icon)
        else:
            development.append(icon)
    a.json({"icons": icons, "development": development})
