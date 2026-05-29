# Mochi Home app
# Copyright Alistair Cunningham 2025-2026

# Check if an ID looks like an entity ID (50-51 chars)
def is_entity_id(id):
    return len(id) >= 50 and len(id) <= 51

def action_restore_dismiss(a):
    """Permanently hide the post-restore banner for this user."""
    a.user.preference.set("restore.show", "false")
    a.json({"ok": True})

def action_icons(a):
    """Return list of app icons for the home screen"""
    result = mochi.app.icons()
    help_unvisited = bool(a.user) and a.user.preference.get("help.visited") != "true"
    icons = []
    development = []
    for icon in result["icons"]:
        if help_unvisited and icon.get("link") == "help":
            icon["highlight"] = True
        if is_entity_id(icon["id"]):
            icons.append(icon)
        else:
            development.append(icon)
    response = {"icons": icons, "development": development}
    if "icon_mask" in result:
        response["icon_mask"] = result["icon_mask"]
    if "icon_background" in result:
        response["icon_background"] = result["icon_background"]
    a.json(response)
