# Mochi Home app
# Copyright Alistair Cunningham 2024-2025

def action_home(a):
	welcome = False

	action = a.input("action")
	if action == "clear":
		mochi.service.call("notifications", "clear.all")
		a.redirect("/")
		return

	elif action == "welcome":
		welcome = True

	a.template("home", {
		"user": a.user(),
		"icons": mochi.app.icons(),
		"notifications": mochi.service.call("notifications", "list"),
		"welcome": welcome
	})
