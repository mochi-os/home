# Mochi Home app
# Copyright Alistair Cunningham 2024-2025

def action_home(action, inputs):
	welcome = False

	a = inputs.get("action", "")
	if a == "clear":
		mochi.service.call("notifications", "clear.all")
		#mochi.action.redirect("/")
		return

	elif a == "welcome":
		welcome = True

	mochi.action.write("home", action["format"], {
		"user": mochi.user.get(),
		"icons": mochi.apps.icons(),
		"notifications": mochi.service.call("notifications", "list"),
		"welcome": welcome
	})
