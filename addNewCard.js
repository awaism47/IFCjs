document.getElementById("createScene").addEventListener("click",()=>{
    const original = document.getElementById('cards');

    const clone = original.cloneNode(true); 
    clone.id="";
    document.getElementById("scenes").appendChild(clone)
})