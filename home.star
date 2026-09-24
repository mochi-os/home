# Mochi Home app
# Copyright © 2026 Mochisoft OÜ
# SPDX-License-Identifier: AGPL-3.0-only
# This file is part of Mochi, licensed under the GNU AGPL v3 with the
# Mochi Application Interface Exception - see license.txt and license-exception.md.

def action_restore(a):
    """The post-restore banner's state: the source server to clean up, the
    sign-ins to re-link and whether passkeys need re-registering. None once
    dismissed, or for an account that did not arrive by restore."""
    return {"data": a.user.restore()}

def action_restore_dismiss(a):
    """Permanently hide the post-restore banner for this user."""
    a.user.preference.set("restore.show", "false")
    a.json({"ok": True})

def action_icons(a):
    """Return list of app icons for the home screen"""
    result = mochi.app.icons()
    help_unvisited = a.user.preference.get("help.visited") != "true"
    icons = []
    for icon in result["icons"]:
        # The app at the root path is this home screen; its icon is for the
        # menu's grid, not its own.
        if icon.get("link") == "":
            continue
        if help_unvisited and icon.get("link") == "help":
            icon["highlight"] = True
        icons.append(icon)
    response = {"icons": icons}
    if "icon_mask" in result:
        response["icon_mask"] = result["icon_mask"]
    if "icon_background" in result:
        response["icon_background"] = result["icon_background"]
    a.json(response)
