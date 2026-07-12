/*
==========================================================
Website : Kuliner Halal Berastagi
File    : script.js (Revisi Tanpa Deskripsi & Modal Simple)
==========================================================
*/

/* ============================
   Mengambil Elemen HTML
============================ */

const restaurantList = document.getElementById("restaurantList");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("detailModal");
const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalAddress = document.getElementById("modalAddress");

/* ============================
   Fungsi Levenshtein Distance
============================ */

function getLevenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

/* ============================
   Menampilkan Semua Restoran
============================ */

function displayRestaurants(data){

    restaurantList.innerHTML = "";

    data.forEach(item=>{

        const card=document.createElement("div");

        card.className="card";

        // Deskripsi tempat telah dihapus dari card HTML
        card.innerHTML=`
            <img src="${item.image}" alt="${item.name}">
            <div class="card-body">
                <h3>${item.name}</h3>
                <div class="badge">🕌 Halal</div>
            </div>
        `;

        card.addEventListener("click",function(){
            showDetail(item);
        });

        restaurantList.appendChild(card);
    });

}

/* ============================
   Popup Detail
============================ */

function showDetail(item){

    modalImage.src=item.image;
    modalImage.alt=item.name;

    // Hanya menampilkan Nama dan Alamat di Modal
    modalTitle.textContent=item.name;
    modalAddress.textContent=item.address;

    modal.classList.add("show");

}

/* ============================
   Search (Dengan Levenshtein)
============================ */

searchInput.addEventListener("keyup", function() {
    
    const keyword = this.value.toLowerCase().trim();

    if (keyword === "") {
        displayRestaurants(restaurants);
        return;
    }

    const result = restaurants.map(item => {
        const nameWords = item.name.toLowerCase().split(" ");
        let minDistance = Infinity;

        nameWords.forEach(word => {
            const wordPart = word.substring(0, Math.max(keyword.length, 1)); 
            const distance = getLevenshteinDistance(keyword, wordPart);
            if (distance < minDistance) {
                minDistance = distance;
            }
        });

        return { ...item, distance: minDistance };
        
    }).filter(item => {
        const tolerance = keyword.length <= 3 ? 1 : 2; 
        const isIncluded = item.name.toLowerCase().includes(keyword);
        return item.distance <= tolerance || isIncluded;
        
    }).sort((a, b) => {
        return a.distance - b.distance; 
    });

    displayRestaurants(result);
});

/* ============================
   Tombol Close & ESC
============================ */

closeModal.addEventListener("click",function(){
    modal.classList.remove("show");
});

window.addEventListener("click",function(e){
    if(e.target===modal){
        modal.classList.remove("show");
    }
});

document.addEventListener("keydown",function(e){
    if(e.key==="Escape"){
        modal.classList.remove("show");
    }
});

/* ============================
   Pertama Kali Website Dibuka
============================ */

displayRestaurants(restaurants);