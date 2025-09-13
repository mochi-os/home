# Mochi Home app
# Copyright Alistair Cunningham 2024-2025

def action_home(action, inputs):
	mochi.action.write("home", action["format"], {
		"user": mochi.user.get(),
		"icons": mochi.apps.icons(),
		"notifications": (),
#		"notifications": mochi.service.call("notifications", "list"),
		"welcome": inputs.get("welcome", "")
	})
