let mainObj = {
    Money: 60000,
    Resources: {
        Milk: 0,
        Eggs: 0,
        Flour: 0,
        Water: 0,
        Sugar: 0
    },
    Capacities : {
        Eggs: 60,
        Water: 60,
        Flour: 50,
        Sugar: 50,
        Milk: 50
    },
    Rates : {
        Water: 2
    },
    Employees: {
        Bakers: {
            Amount: 1,
            Hire: 100,
            Salary: 12
        },
        Cooks: {
            Amount: 4,
            Hire: 80,
            Salary: 11
        },
        Servers: {
            Amount: 7,
            Hire: 50,
            Salary: 7
        },
        Farmers: {
            Amount: 1,
            Hire: 120,
            Salary: 10
        }
    },
    Inventory: {
        Cake: 20,
        Cookies: 10,
        Pie: 0,
        Danish: 0
    },
    Recipes : {
        Cake: true,
        Cookies: true,
        Pie: false
    },
    Producers : {
        Milk: false,
        Eggs: false,
        Sugar: false,
        Water: false,
        Flour: false,
        Fruit: false
    },
    Rates : [
        {Name: 'Sales', Min: 1, Max: 20}
    ]        
}

let bakeInfo = [
    {Name: 'Cake', Milk: 1, Eggs: 2, Flour: 1, Sugar: 1},
    {Name: 'Cookies', Eggs: 1, Flour: 1},
    {Name: 'Pie', Eggs: 2, Flour: 2, Sugar: 1} 
]

let valueInfo = [
    {Name: 'Cake', Value: 8, ValueEach: 8, Quantity: 1, Limit: 3},
    {Name: 'Cookies', Value: 3, ValueEach: 1, Quantity: 3, Limit: 5},
    {Name: 'Pie', Value: 5, ValueEach: 5, Quantity: 1, Limit: 3}
]

let costInfo = {
    Flour: {
        Cost: 1,
        Amount: 5
    },
    Eggs: {
        Cost: 3,
        Amount: 12
    },
    Sugar : {
        Cost: 1,
        Amount: 10
    },
    Milk : {
        Cost: 2,
        Amount: 5
    },
    Water : {
        Cost: 1,
        Amount: 20
    }
}

/* Interval Variables */
//Main Resource Intervals
let waterInt
let eggsInt
let flourInt
let sugarInt
let milkInt
let fruitInt

//Organic Sale Interval
let saleInt
//Pay Salary Interval
let salInt

/* JSON */
let stringObj = JSON.stringify(mainObj)
let parseObj = JSON.parse(stringObj)

/* Elements */
//Main Resource Harvest Buttons
const harvEggs = document.getElementById('harvEggs')
const harvMilk = document.getElementById('harvMilk')
const harvWater = document.getElementById('harvWater')
const harvFlour = document.getElementById('harvFlour')
const harvFruit = document.getElementById('harvFruit')
const harvSugar = document.getElementById('harvSugar')


/* Resource Functions */ 
//Buy Resources
function buyResource(res, amt) {
    let costPer = costInfo[res].Cost/costInfo[res].Amount
    let roundedPer = costPer.toFixed(2)
    let buyAmt = costInfo[res].Amount * amt
    let diff = mainObj.Capacities[res] - mainObj.Resources[res] 
    if (mainObj.Money >= costInfo[res].Cost) {
        if (buyAmt <= diff) {
            mainObj.Resources[res] = mainObj.Resources[res] += buyAmt
            mainObj.Money = mainObj.Money -= roundedPer * buyAmt
        } else if (diff < buyAmt && mainObj.Resources[res] !== mainObj.Capacities[res]) {
            mainObj.Resources[res] = mainObj.Resources[res] += diff
            mainObj.Money = mainObj.Money -= roundedPer * diff
            console.log(`${diff} purchased, ${res} capacity reached.`)
        } else {
            console.log('Capacity reached!')
        } 
    } else {
        throw new Error('Not enough money!')
    }
    
    updateUI()
}

//Add Resources without Buying 
function addResource(res, amt) {
    let diff = mainObj.Capacities[res] - mainObj.Resources[res]
    if (mainObj.Resources[res] <= mainObj.Capacities[res] - amt) {
        mainObj.Resources[res] += +amt       
    } else if (amt > diff && mainObj.Resources[res] !== mainObj.Capacities[res]) {
        mainObj.Resources[res] += diff
        console.log(`${diff} added, capacity reached!`)
    } else {
        console.log('Capacity reached!')
    }
    updateUI()
}

//Harvest Resources
function harvestResource(res) {

}


/* Baking Functions */
//Index of Recipe
function recipeIndex(arr, srch) {
    for (i = 0; i < arr.length; i++) {
        if (srch == arr[i].Name) {
            return i
        }
    }
    return "not in array"
}

//Bake Item 
function bakeItem(item) {
    //Make Copy of Resources
    let resources = Object.assign({}, mainObj.Resources)
    //Get Index of Recipe
    let recipeTarg = bakeInfo[recipeIndex(bakeInfo,item)]
    //Get Name of Recipe
    let recipeName = recipeTarg.Name
    //Subtract individual ingredients from inventory - error if insufficient
    let keys = Object.keys(recipeTarg)
    let ings = keys.filter(el => el !== 'Name')
    ings.forEach(cur => {
        resources[cur] -= recipeTarg[cur]
        if (resources[cur] < 0 ) {
            alert(`Not enough ${cur}!`)
            throw new Error(`Not enough ${cur}!`)
        } 
    })

    let bakeAmt = valueInfo[recipeIndex(valueInfo, item)].Quantity

    //Remove resources from mainObj inventory
    mainObj.Resources = resources
    //Add Baked item to inventory
    mainObj.Inventory[recipeName] += bakeAmt

    updateUI()

    return true
}

function bakeMulti(item, quantity) {
    for (let i = 0; i < quantity; i++) {
        try {
            bakeItem(item)
        } catch (e) {
            alert(`Finished. ${i} ${item}s baked. ${e}`)
            break
        }
    }
}

function getBakeAble() {
    let ingOpt = Object.assign({}, mainObj.Resources)
    let ings
    let finArr = []
    for (let i = 0; i < bakeInfo.length; i++) {
        //Get Required Ingredients to check for
        let keys = Object.keys(bakeInfo[i])
        let resArr = []
        //Filter Out Name
        ings = keys.filter(el => el !== 'Name')
        for (let j = 0; j < ings.length; j++) {
            //Required Ingredient Name
            let choice = ings[j]
            //Required Ingredient Amount
            let sel = bakeInfo[i][choice]
            //If Inventory amount is greater than req'd amount
            if (ingOpt[choice] >= sel) {
                resArr.push(true)
            } else {
                resArr.push(false)
            }        
        }
        if (resArr.includes(false)) {
            
        } else {
            finArr.push(bakeInfo[i].Name)
        }
        
    }
    return finArr
}

function employeeBake() {
    let recOpt = Object.entries(mainObj.Recipes)
    let optArr = [] 
    recOpt.forEach((cur) => {
        if (cur[1] == true && getBakeAble().includes(cur[0])) {
            optArr.push(cur[0])
        }
    })
    let randSel = Math.floor((Math.random() * optArr.length - 1) +1)
    bakeItem(optArr[randSel], 1)
    console.log(optArr[randSel] + ' baked')
    updateUI()
}

/* Money Functions */ 
//Base Sale Function
function sale() {
    let menu = Object.assign({}, mainObj.Inventory)
    let mentries = Object.entries(menu)
    let selArr = mentries.filter(cur => {
        return cur[1] > 0
    })
    
    if (selArr.length == 0) {
        throw new Error('Nothing to sell!')
    } else {
        let keys = Object.keys(menu)
        let randSel = Math.floor((Math.random() * selArr.length - 1) +1)
        let sel = keys[randSel]
        let buyMax
        let maxAmt = selArr[randSel][1]
        let itemLimit = valueInfo[recipeIndex(valueInfo, sel)].Limit
        if (maxAmt > itemLimit) {
            buyMax = itemLimit
        } else {
            buyMax = maxAmt
        }
        let buyAmt = Math.floor((Math.random() * buyMax) +1)
        menu[sel] = menu[sel] - buyAmt
        let itemVal = valueInfo[recipeIndex(valueInfo, sel)].Value
    
        mainObj.Money = mainObj.Money += buyAmt * itemVal
        mainObj.Inventory = menu
        console.log('Sale success!')
    }
    
    updateUI()

    
}

//Transaction Function
function transact() {
    let rand = Math.floor((Math.random() * 100) +1)
    if (rand < 25 && rand > 5) {
        sale()
        sale()
    } else if (rand <= 5) {
        sale()
        sale()
        sale()
    } else {
        sale()
    }
}


//Pay Salaries - Base Function
function pay() {
    let salArr = Object.entries(mainObj.Employees)
    salArr.forEach((cur) => {
        let total = cur[1].Salary * cur[1].Amount
        if (mainObj.Money >= total) {
            mainObj.Money = mainObj.Money - total
        } else {
            let emptype = cur[0]
            mainObj.Employees[emptype].Amount = 0
            console.log('Employees quit!')
        }
    })
    updateUI()
}

/* Employee Actions */
function hireBaseEmp() {

}



/* Time Interval Functions */
//Generate random Time Interval Between One and x Seconds
function randInt(max) {
    let rand = Math.floor((Math.random() * max) +1) * 1000
    return rand
} 

function randBetween(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//Pay Salaries
let paySalaries = () => {
    clearInterval(salInt)
    salInt = setInterval( function() { 
        pay()
     }, 300000 )
}


//Add Resource
function intervalAddResource(res, amt, rate) {
    setInterval( function() { addResource(res, +amt) }, rate * 1000 )
}

function intervalAssign(assig, res, amt, rate) {
    clearInterval(assig)
    assig = setInterval( function() { addResource(res, +amt) }, rate * 1000 )
}

//Customer Buys Item
function organicSale() {
  clearInterval(saleInt)
  saleInt = setInterval( function() { transact() }, randInt(mainObj.Rates[0].Max) )
}

//Initiate ALL Time Interval Functions
function allInts() {
    paySalaries()
    organicSale()
}




/* Rendering - UI Updating */
//Disable Buttons
function disableButt(id) {
    id.disabled = true
}

//Check Harvestable
function checkHarv() {
    if (mainObj.Producers.Eggs == false) {
        disableButt(harvEggs)
    } 
    if (mainObj.Producers.Milk == false) {
        disableButt(harvMilk)
    }
    if (mainObj.Producers.Water == false) {
        disableButt(harvWater)
    }
    if (mainObj.Producers.Flour == false) {
        disableButt(harvFlour)
    }  
    if (mainObj.Producers.Sugar == false) {
        disableButt(harvSugar)
    }
    if (mainObj.Producers.Fruit == false) {
        disableButt(harvFruit)
    }
}


//Universal Render
function univRender(elem, content) {
    document.getElementById(elem).innerHTML = content
}

//Update UI
function updateUI() {
    //Main Resources
    univRender('waterAmt', mainObj.Resources.Water)
    univRender('flourAmt', mainObj.Resources.Flour)
    univRender('eggAmt', mainObj.Resources.Eggs)
    univRender('milkAmt', mainObj.Resources.Milk)
    univRender('sugarAmt', mainObj.Resources.Sugar)
    

    univRender('moneyAmt', mainObj.Money)
    univRender('cake', mainObj.Inventory.Cake)
    univRender('cookies', mainObj.Inventory.Cookies)
    univRender('pie', mainObj.Inventory.Pie)
    
    univRender('danish', mainObj.Inventory.Danish)

    /* Functions to Call */
    //Check harvestable - enable/disable buttons
    checkHarv()
}


/* On Start */
updateUI()