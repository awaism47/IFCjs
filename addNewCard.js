document.getElementById("createScene").addEventListener("click",()=>{
    const original = document.getElementById('cards');
    const numberOfCards=document.getElementsByClassName('card-title')

    const clone = original.cloneNode(true); 
    clone.id=numberOfCards.length;
    document.getElementById("scenes").appendChild(clone)
    document.getElementById(clone.id).children[0].firstElementChild.textContent=`Building ${numberOfCards.length}`
    console.log()
    
})