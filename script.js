'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const dipslayMovements = function(movements, sort = false){
    containerMovements.innerHTML = '';
    const movs = sort ? movements.slice().sort((a,b) => a -b) : movements

  movs.forEach(function(mov, i){

    

    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i +1} ${type}</div>
         
        <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html)
})
}



const calcDisplayBalance = function(acc){
   acc.balance = acc.movements.reduce((acc, mov)=> acc + mov, 0 );

  labelBalance.textContent = `${acc.balance} EUR`
}


const calcDisplaySummary = function(acc){
const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, curr) => acc+curr, 0)
labelSumIn.textContent = incomes 

const out  = acc.movements.filter(mov => mov < 0).reduce((acc, curr) => Math.abs(acc-curr) , 0)
labelSumOut.textContent = out 

const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate/100)
.filter(int => int >= 1)
.reduce((acc, int) => acc+int, 0)
labelSumInterest.textContent = interest
}



const createUserNames = function(accs){
    accs.forEach(function(acc){
        acc.userName = acc.owner
        .toLowerCase().split(' ').map(name => name[0]).join('');
         
    })  
}
createUserNames(accounts);

const updateUI = function(acc){

     dipslayMovements(acc.movements);
      calcDisplayBalance(acc);
      calcDisplaySummary(acc);
}
//EVENT HANDLER
let currentAccount;

btnLogin.addEventListener('click', function(e){
  e.preventDefault()
  
  currentAccount= accounts.find( acc => acc.userName === 
    inputLoginUsername.value);
    console.log(currentAccount)

    if(currentAccount?.pin === Number(inputLoginPin.value)){

      labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
      
      containerApp.style.opacity = 100;
      inputLoginUsername.value = inputLoginPin.value =  ''
      inputLoginPin.blur()

        updateUI(currentAccount)
      
    }
    
})

btnTransfer.addEventListener('click', function(e){
e.preventDefault();
const amount =Number(inputTransferAmount.value) 
const receiverAcoount =accounts.find(acc => acc.userName === inputTransferTo.value) ;
inputTransferAmount.value = inputTransferTo.value = ''

if(amount> 0 && receiverAcoount && currentAccount.balance >= amount && receiverAcoount?.userName !== currentAccount.userName){
  currentAccount.movements.push(-amount);
  receiverAcoount.movements.push(amount);
  updateUI(currentAccount)
}
})

btnLoan.addEventListener('click', function(e){
e.preventDefault()
const amount = Number(inputLoanAmount.value)

if(amount>0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
  currentAccount.movements.push(amount)

  updateUI(currentAccount)
  inputLoanAmount.value = ''

}


})

btnClose.addEventListener('click', function(e){
e.preventDefault()


if(Number(inputClosePin.value) == currentAccount.pin && inputCloseUsername.value == currentAccount.userName){
  
  const index = accounts.findIndex(acc => acc.userName === currentAccount.userName)

  accounts.splice(index,1)

  containerApp.style.opacity = 0;

  inputClosePin.value = inputCloseUsername.value = ''
}
})

let sorted = false;
btnSort.addEventListener('click', function(e){
e.preventDefault()
dipslayMovements(currentAccount.movements, !sorted);
sorted = !sorted
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposits = movements.filter((mov) => mov >0 )
const withdrawals = movements.filter((mov) => mov < 0 )
console.log(movements)
/////////////////////////////////////////////////

const balance = movements.reduce(function(acc, cur){
return acc + cur
}, 0)
