// This script is meant to be pasted in the dev console of a browser, not run via node

// Usage:
// 1. Reset local storage
// 2. Navigate to desired semester (e.g. FL2024)
// 3. Run entire script once per school (a couple minutes of manual work)
// 4. Get from local storage

/* Result from FL2024:
data = JSON.parse(`{"Bixby":"4:30P","Walker Hall":"4:30P","Busch":"7:00P","Steinberg":"6:00P","Weil":"6:00P","Wilson":"4:00P","Simon":"6:15P","Eads":"6:30P","Kemper":"5:00P","Givens":"6:30P","McMillan":"5:30P","January Hall":"7:00P","Jubel":"6:00P","Seigle":"7:00P","Lopata House":"6:00P","Duncker":"5:30P","Music Cls Bldg":"5:00P","Cupples II":"7:00P","Danforth Ctr":"3:00P","Umrath":"4:00P","Crow":"6:00P","Louderman":"4:00P","Wrighton":"6:30P","McDonnell":"6:00P","Life Sciences":"6:30P","Mallinckrodt":"6:00P","Hillman":"5:30P","Cupples I":"6:00P","Lopata Hall":"6:00P","Rebstock":"6:00P","Brown":"7:00P","Somers Family":"4:00P","Tietjens Hall":"4:00P","Sever":"6:00P","Ridgley":"6:00P","Stix":"4:00P","AB Law Bldg":"6:30P","Whitaker":"5:30P","Sumers Rec Ctr":"9:00A","South Campus":"4:00P","Athletic Complx":"1:30A","Rudolph":"6:00P","Gaylord":"2:00P","Schnuck Pav":"4:30P","Village House":"4:00P","Wom Bldg":"5:30P","560 Music Cntr":"7:30P","Blewett":"2:30P","West Campus":"2:00P","Academy Bldg":"4:00P","S40 Lien":"3:00P","S40 Dardick":"4:30P","S40 Liggett":"4:30P","S40 Gregg":"3:00P","Compton":"5:00P","Children's Hosp":"1:30P","Jolley":"6:30P","BJCIH":"3:00P","Farrell T/L Ctr":"6:30P","Becker Library":"5:30P","Clinical Sci":"4:00P","South Building":"2:00P","Mid Campus Ctr":"2:00P","Lewis Center":"3:00P","Bauer":"7:45P","Knight Hall":"6:15P","Goldfarb":"5:30P","Brauer Hall":"6:00P","Green Hall":"5:30P","Urbauer":"7:00P","North Campus":"5:00P","Taylor Ave Bldg":"1:00P","CID":"5:30P","McDonnell Ped":"4:00P"}`);
*/

/* Use to print sorted:
keys = Object.keys(data);
keys.sort()
for (const key of keys)
  console.log(key, data[key]);
*/

/* Use to reset:
localStorage.removeItem("latest");
*/

/* Use to get:
localStorage.getItem("latest");
*/

// Delay until loading finished, in which case resolve, or timeout ms has elapsed, in which case reject
async function delay(timeout) {
  return new Promise((res, rej) => {
    // Early exit if loading element is hidden
    // We assume that the loading element had been made visible before the first time this interval is called
    let interval = setInterval(() => {
      const loading = document.getElementById('imgload')
      if (loading.style.display === 'none') {
        clearInterval(interval)
        res()
      }
    }, 1000)

    // Timeout as a fallback
    setTimeout(() => {
      clearInterval(interval)
      rej()
    }, timeout)
  })
}

// Converts a string of the form "5:30P" to minutes since midnight (midnight is zero)
function stringToMinutes(time) {
  const [timePart, modifier] = time.split(/(?=[AP])/)
  let [hours, minutes] = timePart.split(':').map(Number)

  if (modifier === 'P' && hours !== 12) hours += 12
  else if (modifier === 'A' && hours === 12) hours = 0

  return hours * 60 + minutes
}

// Read every table on the page, and if it is well formatted, update the maximum (stored in localStorage) for the relevant building
function updateMaximums() {
  let latest = JSON.parse(localStorage.getItem('latest') || '{}')

  for (const table of document.querySelectorAll('.MainTableRow')) {
    const row = table.querySelector('tr')
    if (row === null) continue

    const children = row.children
    const days = children[2].textContent
    const times = children[3].textContent
    const buildingAndRoom = children[4].textContent
    if (days === null || times === null || buildingAndRoom === null) continue

    const [building, _room] = buildingAndRoom.split(' / ')
    if (['(None)', 'See Instructor', 'Remote', 'TBA'].includes(building))
      continue

    if (/^[-M][-T][-W][-R][-F][-S][-S]$/.test(days)) {
      const bounds = /(\d:\d\d[AP])/g.exec(times) || []

      for (const bound of bounds)
        if (
          latest[building] === undefined ||
          stringToMinutes(bound) > stringToMinutes(latest[building])
        )
          latest[building] = bound
    }
  }

  localStorage.setItem('latest', JSON.stringify(latest))
}

// Main
;(async () => {
  const departments = document.querySelector('.Departments')
  for (const department of departments.querySelectorAll('td a')) {
    const name = department.textContent
    console.log(name)

    department.dispatchEvent(new MouseEvent('click'))
    await delay(30_000)
    updateMaximums()

    // If we have an all departments option, we're done
    // Otherwise, we will have to brute force check every department
    if (name.startsWith('All Departments')) break
  }

  console.log('done')
})()
