## Description:

Travel map is an application for those who love order in photos after each trip.
- the ability to sort photos by country;<br>
- automatic sorting of photos by countries;<br>
- View photos of the selected country.<br>


## Action plan:

### `registration form / login`

[Link branch](https://github.com/MarikTar/travel_map/tree/robert);<br>
- implement login / registration form on the local server;<br>
- implement user database:<br>
[{<br>
	`login`: `true`,
	`username`: `loginName`,
	`password`: 'password',
	`memory`: [{
				`country`: 'countryName';
				`url`: `[img1.jpg,img2.jpg,...]`
			},{...}]
},{...}];

### `main window`

[Link branch](https://github.com/MarikTar/travel_map/tree/work_Taras);<br>
- display a map of the world;<br>
- display a list of countries in the world;<br>
- implement button to call the window for adding photos;<br>

### `window for adding / viewing photos`

[Link branch](https://github.com/MarikTar/travel_map/tree/Kharya1337);<br>
- implement button to add photos;<br>
- display added photos;<br>
- implement sorting of photos by metadata;<br>

### `structure`
```
procject/
├── src/
│   ├── assets/ - dir for a static images, svgs, audio, etc
│   │   ├── img/ - dir for png/jpeg images
│   │   ├── svg/ - dir for svg images (could be omited if small amount)
│   │   └── favicon.ico - favicon file
│   │
│   ├── components/ - dir for presentative components
│   │   └── component_name/ - example of component directory
│   │       ├── styles/
│   │       │   └── index.css
│   │       └── index.jsx
|	|
│   ├── index.html - main html file
│   ├── routing.jsx - file with react-router for example that defines pages of app
│   └── index.jsx - main jsx file
│
├── package.json
└── README.md
```
