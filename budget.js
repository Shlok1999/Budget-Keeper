/* www.youtube.com/CodeExplained */

//Select the Elements//

const balanceEl=document.querySelector('.balance .value')

const incomeTotalEl=document.querySelector('.income-total')

const outcomeTotalEl=document.querySelector('.outcome-total')

const incomeEl=document.querySelector('#income')

const expenseEl=document.querySelector('#expense')

const allEl=document.querySelector('#all')

const incomeList=document.querySelector('#income .list')

const expenseList=document.querySelector('#expense .list')

const allList=document.querySelector('#all .list')


//Select Buttons//

const expenseBtn=document.querySelector('.tab1')
const incomeBtn=document.querySelector('.tab2')
const allBtn=document.querySelector('.tab3')

//Input Buttons
const addExpense=document.querySelector('.add-expense')
const expenseTitle=document.getElementById('expense-title-input')
const expenseAmount=document.getElementById('expense-amount-input')

const addIncome=document.querySelector('.add-income')
const incomeTitle=document.getElementById('income-title-input')
const incomeAmount=document.getElementById('income-amount-input')


//Variables
let ENTRY_LIST=[];
let balance=0, income=0, outcome=0
const DELETE="delete", EDIT="edit";
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();




//EVENT LISTENER

incomeList.addEventListener('click',deleteOrEdit)
expenseList.addEventListener('click',deleteOrEdit)
allList.addEventListener('click',deleteOrEdit)

expenseBtn.addEventListener('click',()=>{
    show(expenseEl)
    hide([incomeEl,allEl])
    active(expenseBtn)
    inactive([incomeBtn,allBtn])
})
incomeBtn.addEventListener('click',()=>{
    show(incomeEl)
    hide([expenseEl, allEl])
    active(incomeBtn)
    inactive([expenseBtn,allBtn])
})
allBtn.addEventListener('click',()=>{
    show(allEl)
    hide([expenseEl, incomeEl])
    active(allBtn)
    inactive([incomeBtn,expenseBtn])
})

addExpense.addEventListener('click',()=>{
    //iF JUSRT ONE OF THEM IS EMPTY
    if(!expenseTitle.value || !expenseAmount.value){
        return;
    }
    let expense={
        type: "expense",
        title: expenseTitle.value,
        amount: parseInt(expenseAmount.value)
    }
    ENTRY_LIST.push(expense)
    // console.log(ENTRY_LIST)
    updateUI();
    clearInput([expenseTitle, expenseAmount]);
})
addIncome.addEventListener('click',()=>{
    //iF JUSRT ONE OF THEM IS EMPTY
    if(!incomeTitle.value || !incomeAmount){
        return;
    }
    let income={
        type: "income",
        title: incomeTitle.value,
        amount: parseInt(incomeAmount.value)
    }
    ENTRY_LIST.push(income)
    // console.log(ENTRY_LIST)
    updateUI();
    clearInput([incomeTitle, incomeAmount]);
})
localStorage.setItem('entry-list',ENTRY_LIST);




//Functions

function show(element){
    element.classList.remove("hide")
}
function hide(elements){
    elements.forEach(element => {
        element.classList.add("hide")
        
    });
}
function active(element){
    element.classList.add("active")
}
function inactive(elements){
    elements.forEach(element => {
        element.classList.remove("active")
        
    });
}

function deleteOrEdit(event){
    const targetBtn=event.target;

    const entry=targetBtn.parentNode;

    if(targetBtn==DELETE){
        deleteEntry(entry)
    }else if(targetBtn.id==EDIT){
        editEntry(entry)

    }

    deleteEntry(entry);
    editEntry(entry);

}
function deleteEntry(entry){
    ENTRY_LIST.splice(entry.id, 1)
    updateUI();

}
function editEntry(entry){
    let ENTRY=ENTRY_LIST[entry.id]

    if(entry.type=='income'){
        incomeAmount.value==entry.amount;
        incomeTitle.value==entry.title;

    }
    else if(entry.type=='expense'){
        expenseAmount.value=entry.amount;
        expenseTitle.value=entry.title;
    }

}

//UPDATE THE UI FUNCTION
function updateUI(){
    income=calculateTotal('income', ENTRY_LIST);
    outcome=calculateTotal('expense', ENTRY_LIST);
    balance=calculateBalance(income,outcome);
    

    



    //Determine the Sign of the balance
    let sign=(income>=outcome)? "$": "-$";

    balanceEl.innerHTML=`<small>${sign}</small>${Math.abs(balance)}`
    outcomeTotalEl.innerHTML=`<small>${sign}</small>${Math.abs(outcome)}`
    incomeTotalEl.innerHTML=`<small>${sign}</small>${Math.abs(income)}`
    //UPDATE UI
    clearElement([expenseList, incomeList, allList])

    ENTRY_LIST.forEach((entry, index)=>{
        if(entry.type=='expense'){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index)
        }
        else if(entry.type=='income'){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
        
        showEntry(allList, entry.type, entry.title, entry.amount, index)
        
    })
    updateChart(income, outcome);
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type,title, amount, id){
    const entry=`
        <li id="${id}" class="${type} ">
            <div class="entry">${title}: $${amount}</div>
            <div id="edit">Edit</div>
            <div id="delete"></div>
        </li>
    `
    const position="afterbegin";
    list.insertAdjacentHTML(position, entry)
}

function clearElement(elements){
    elements.forEach(element=>{
        element.innerHTML=""
    })

}


function calculateTotal(type,list){
    let sum=0;
    list.forEach(entry=>{
        if(entry.type==type){
            sum+=entry.amount
        }
    })

    return sum;
}
function calculateBalance(income, outcome){
    return income-outcome;

}

function clearInput(inputs){
    inputs.forEach(input=>{
        input.value=""
    })
}

