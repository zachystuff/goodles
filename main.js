//global variables that dont change
let container = document.querySelector('.row');

let date = new Date();
//
let datecontainer = document.getElementById('header-nav');

let dateControl = document.querySelector('input[type="date"]');

const API = 'https://google-doodles.herokuapp.com/doodles/year/month?hl=en';

const GOOGLE_QUERY = "https://www.google.com/search?q=query";

const doodlesSearchCache = {};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const COLORS = ['green', 'blue', 'red', 'yellow'];

//fetch from api
async function fetchDoodles(year, month) {
    let updatedAPI = API.replace('year', year).replace('month', month);
    const RES = await fetch(updatedAPI);
    const DOODLES = await RES.json();
    return DOODLES;
}

async function buildDoodleCache(year, month) {
    // check at initialization if year and month are undefined;
    if (year == undefined && month == undefined) {
        year = date.getFullYear();
        month = date.getMonth() + 1;
    }
    const doodles = await fetchDoodles(year, month);
    doodles.map(doodle => {
        const {title, high_res_url, run_date_array} = doodle;
        const [year, month, day] = run_date_array;

        const NEWDOODLE = {
            title,
            high_res_url,
            year,
            month,
            day
        }

        container.append(createCard(NEWDOODLE));
    });
}

//Creates Card
function createCard(doodle){
    console.log(doodle);
    let section = document.createElement('section');
    section.className = 'col-xs-12 col-md-4 _section-size';

    let card = document.createElement('div');
    card.className = 'card';

    let img = document.createElement('img');
    img.className = 'card-img-top _card-img-size';
    img.src = doodle['high_res_url'];
    img.alt = doodle['title'];

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = doodle['title'];
    cardBody.append(cardTitle);

    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = `${MONTHS[doodle["month"]]} ${doodle["day"]}, ${doodle["year"]}`
    cardBody.append(cardText);

    let doodleLink = document.createElement('a');
    doodleLink.textContent = 'What in the doodle?';
    doodleLink.target = '_blank';
    doodleLink.href = GOOGLE_QUERY.replace('query', doodle['title']);
    cardBody.append(assignColor(doodleLink));

    card.append(img);
    card.append(cardBody);

    section.append(card);

    return section;
}

// submit function
function submitDR(e){
    e.preventDefault();
    let [UIYear, UIMonth] = dateControl.value.split('-');
    container.innerHTML = '';
    buildDoodleCache(UIYear, UIMonth);
    console.log('fetched Doodle');
}

function getRandomColor() {
    let colorIndex = Math.floor(Math.random() * 4);
    let color = COLORS[colorIndex];
    return color;
}

function assignColor(element) {
    let color = getRandomColor();
    element.classList = `google-${color} btn btn-primary`;
    element.style.borderColor = 'unset';
    return element;
}