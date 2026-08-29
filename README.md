# CLARITY-v0.0

Voice-first, hands-free campus navigation for blind and low-vision students at NITK Surathkal.

You speak, Clarity speaks back, and your phone buzzes in Morse-style patterns so the whole
journey works with the screen off and the phone in your pocket.

34 campus locations with real OpenStreetMap coordinates
Real pedestrian routing via OSRM, following actual footpaths instead of straight lines
Wake word: say "Clarity" then your command, no tapping needed
Morse haptics: dot-dash for left, dash-dot-dot for right, three long buzzes on arrival
Installable PWA, app shell works offline
Zero dependencies, zero build step, zero cost
Run it locally
Bash

cd clarity
python3 -m http.server 8000
Then open http://localhost:8000

localhost counts as a secure origin, so the microphone works here. It will not work if
you double-click 
index.html
 to open it as a file:// URL, because browsers block the mic on
non-HTTPS pages.

Deploy
You need HTTPS in the deployed version or the microphone is blocked. Both options below are
free and give you HTTPS automatically.

Option A: Netlify Drop (fastest, about 30 seconds)
Go to https://app.netlify.com/drop
Drag the whole clarity folder onto the page
You get a live https:// URL instantly
Best choice if you are demoing tomorrow and just need a link right now.

Option B: GitHub Pages (about 2 minutes)
Create a new repo on GitHub, name it clarity
Push this folder (see below)
In the repo, go to Settings, then Pages
Under Source, pick Deploy from a branch
Branch: main, folder: / (root), click Save
Wait about a minute, then open https://YOUR_USERNAME.github.io/clarity/
Pushing to GitHub
From inside this folder:

Bash

git init
git add .
git commit -m "Clarity: voice-first campus navigation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/clarity.git
git push -u origin main
If the repo already has a README or licence on GitHub, pull first:

Bash

git pull origin main --rebase
git push -u origin main
File map
File	What it does

index.html
The entire app: UI, styles, and all logic in one file

manifest.webmanifest
PWA metadata, makes it installable

sw.js
Service worker, caches the app shell for offline use

icon-192.png
, 
icon-512.png
App icons

apple-touch-icon.png
Home screen icon for iPhone

.nojekyll
Stops GitHub Pages from running Jekyll on the files
Only 
index.html
 matters if you are in a hurry. It runs standalone with no build step.

Voice commands
Say this	What happens
"Clarity"	Wakes it up, then say your command
"Take me to SJA"	Routes from your GPS location
"Mess to library"	Routes between two named places
"Take me to the library from the main gate"	Explicit start and end
"Where am I?"	Announces your nearest landmark
"Next"	Reads the next step
"Repeat"	Repeats the current step
"Start"	Begins live GPS guidance with auto advance
"Pause" / "Stop"	Pauses or ends navigation
"List places"	Reads out every destination
"Help"	Explains everything
You can also type any command into the box, or use the keyboard:
Space to speak, N next, R repeat, Esc stop.

Browser support
Platform	Speech	Vibration	Notes
Android Chrome	Yes	Full patterns	Best experience, install as a PWA
iPhone Safari	Yes	One blip only	Safari has no Vibration API, see below
Desktop Chrome / Edge	Yes	No hardware	Good for demos on a laptop
Firefox	No	Yes	Speech recognition sits behind a flag
iOS haptics: Safari does not implement the Vibration API at all. Clarity falls back to a
hidden <input switch> trick that fires one genuine system haptic per event. You get the
buzz, but not the full Morse pattern. Full patterns need Android Chrome, or a native build.

Routing needs internet. The app shell is cached offline, but OSRM routing and map tiles
are fetched live.

Known limitations
Be upfront about these if you are presenting, judges respect it:

OSRM is a public demo server (routing.openstreetmap.de). It has no uptime guarantee.
Production would mean self-hosting OSRM or paying for a routing API.
iOS haptics are one blip, not patterns. WebKit limitation, needs a native app to fix.
GPS accuracy outdoors is roughly 5 to 15 metres. Step advance triggers within about
16 m of a turn, so tight indoor junctions are unreliable.
Speech recognition needs internet on Chrome and Edge, since audio goes to a cloud
service. Safari can do it on device.
Place data is hand-mapped, 34 points covering the main campus. Adding a place means
one line in the PLACES array.
Hackathon demo script (90 seconds)
Open the deployed HTTPS link on an Android phone, in its own tab.
Tap Enable microphone, then Allow.
Say "Clarity", then "take me to the mess".
It reads back the distance, the time, and the first step, and buzzes.
Say "next" a couple of times to walk the steps.
Say "start" and walk a few metres. It auto-advances and buzzes at each turn.
Close the screen, keep walking. The vibration pattern tells you which way to turn.
That is the moment that lands it.
If the mic is being difficult, fall back to typing the same commands into the box. The
demo still works end to end.

Adding a place
One line in the PLACES array near the top of 
index.html
:

JavaScript

{id:"new-place", name:"New Place", lat:13.0100, lng:74.7945,
 aliases:["nickname","short name","what people actually call it"]},
The fuzzy matcher handles nicknames and mishearings, so add plenty of aliases.
