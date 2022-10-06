//addElements

let body = document.body;
let header = document.querySelector(".header");
let main = document.querySelector(".main");
let contentRender = body.querySelector(".table__body");
let template = body.querySelector("#template").content;
let sort = body.querySelector(".currency__sort");
let filter = body.querySelector(".currency__filter");
let searchInput = body.querySelector(".search-input");
let elItem = template.cloneNode(true);
let modalBtn = body.querySelector(".modal-btn");
let loader = body.querySelector(".loader");


//get from fetch;

const localCurrencies = localStorage.getItem("currencies");

let currencies = [];

if (localCurrencies) {
    currencies = JSON.parse(localCurrencies);
}

async function getData(url) {
   try {
    const rawData = await fetch(url);
    const { data } = await  rawData.json();
    
    let status = rawData.status;

    currencies = data.map(obj => ( {
       ...obj,
       Diff : obj.Diff*1,
    })
    );

    localStorage.setItem("currencies", JSON.stringify(currencies));
   } catch (error) {
    
    console.error(error);
    console.error("Please, connnect to network!");
   } 
   finally {
      loader.classList.add("d-none"); 
   }
}

getData("https://pressa-exem.herokuapp.com/api-49");

console.log(currencies);

// console.log(typeof currencies[0].Diff);
//createElement

function createElement(currency) {
  let elItem = template.cloneNode(true);

  // = currency.id
  elItem.querySelector(".table-id").textContent = currency.Code;
  elItem.querySelector(".table-name").textContent = currency.CcyNm_UZ;
  elItem.querySelector(".table-name-code").textContent = currency.Ccy;
  elItem.querySelector(".table-price").textContent = currency.Diff;
  elItem.querySelector(".table-update").textContent = currency.Date;
  // elItem.querySelector(".bookmark-btn").dataset.id = currency.id;
  elItem.querySelector(".bookmark-img").dataset.id = currency.id;

  return elItem
}

//render

function render(currencies) {
  contentRender.innerHTML = "";
  
  let listFragment = document.createDocumentFragment();

  currencies.forEach((currency) => {
    listFragment.append(createElement(currency))
  });

  contentRender.appendChild(listFragment)
}



//search  
  searchInput.addEventListener("input", () => {
    let inputValue = searchInput.value.toLowerCase().trim();
    let searchCurrencies = currencies.filter(currency => currency.CcyNm_UZ.toLowerCase().includes(inputValue));
    
    searchInput.value = "";

    render(searchCurrencies);
  })

//sort 
let sortArr = [...currencies];

sort.addEventListener("change", () => {
  sortArr.sort((a,b) => {
    if(a.Diff > b.Diff) return 1;
    if(a.Diff < b.Diff) return -1;
    return 0;
  })
  
  if (sort.value === "bs") {
    render(sortArr.reverse())
  }
  else if (sort.value === "sb") {
    render(sortArr)
  }
  else if (sort.value === "default"){
    render(currencies);
  }
})

//filter
filter.addEventListener("input", () => {
    let inputValue = filter.value.trim()*1;
    let filterData = sortArr.filter(currency => currency.Diff > inputValue);

    render(filterData);
})    

//modal
let result = localStorage.getItem("result");

setTimeout(() => {
    if(!result){
        modalBtn.click();
        localStorage.setItem("result", JSON.stringify("result"));
    }
}, 10000);


//bookmark
let basket = [];
let copyData = [...currencies];
let badge = body.querySelector(".badge-number");


//bookmarkPush
function addObj(id) {
  let findObj = copyData.find(obj => {
    return obj.id == id
  }) 
  if(!basket.includes(findObj)){
  basket.push(findObj)
} 
}


//bookmarkRemove
function removeObj(id) {
  let index = basket.findIndex(obj => {
    return obj.id == id
  }) 

  basket.splice(index, 1)
}


contentRender.addEventListener("click", (e) => {

  if(e.target.matches(".bookmark-img")){

    if(e.target.src.includes("-fill")) {
      e.target.src = "./img/bookmark.svg"
      removeObj(e.target.dataset.id)
    }else {
      e.target.src = "./img/bookmark-fill.svg"
      addObj(e.target.dataset.id)
    }
    badge.textContent = basket.length;
    // console.log(basket);
  }

})



render(currencies);
