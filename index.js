// --- OSMAN'S WAR IO - MANTIK VE GÖRSEL DOSYASI ---

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const rCanvas = document.getElementById('radarCanvas');
const rCtx = rCanvas.getContext('2d');

// 1. HARİTA VE BÖLGE AYARLARI
const MAP_SIZE = 10000;
const CENTER = MAP_SIZE / 2;
const ELMAS_RADIUS = 1200; // En iç bölge (E)
const ALTIN_RADIUS = 3500;  // Orta halka (A)
let pos = { x: 5000, y: 5000 };
let worldObjects = [];

// 2. GÖRSEL TANIMLAMALARI
// Normal (N) - Senin mevcut görsellerin
const imgN = { 
    para: new Image(), 
    disli: new Image(), 
    kasa: new Image(), 
    jen: new Image() 
};
// Not: Buradaki linkleri kendi eski linklerinle değiştir
imgN.para.src = "ESKI_PARA_LINK"; 
imgN.disli.src = "ESKI_TESTERE_LINK";
imgN.kasa.src = "ESKI_KASA_LINK";
imgN.jen.src = "ESKI_JEN_LINK";

// Altın (A) - Senin gönderdiğin linkler
const imgA = { 
    para: new Image(), 
    disli: new Image(), 
    kasa: new Image() 
};
imgA.para.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpjNy8OW8lhUhtntVy_-jPuOBWpyLxzXb-tr5NIwpvqg&s=10";
imgA.disli.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgefH-j_ZZP5JOOMPZoGjRRxInLmLVHvM6kovKdjYgDw&s";
imgA.kasa.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl4BxM22-TpThY7qwhHN3wcJ-ddm5yhJgzcrw_-_knnA&s=10";

// 3. DÜNYA OLUŞTURMA (Bölgelere Göre Dağılım)
function spawnWorld() {
    worldObjects = [];
    for(let i = 0; i < 3500; i++) {
        let rx = Math.random() * MAP_SIZE;
        let ry = Math.random() * MAP_SIZE;
        let dist = Math.hypot(rx - CENTER, ry - CENTER);
        
        let tier = "N"; // Varsayılan Normal
        if(dist < ELMAS_RADIUS) tier = "E";
        else if(dist < ALTIN_RADIUS) tier = "A";

        const r = Math.random();
        let kind = "PARA";
        if(r > 0.97) kind = "JEN";
        else if(r > 0.92) kind = "KASA";
        else if(r > 0.80) kind = "DISLI";

        worldObjects.push({ x: rx, y: ry, kind: kind, tier: tier, id: i });
    }
}

// 4. ÇİZİM DÖNGÜSÜ
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let camX = pos.x - canvas.width / 2;
    let camY = pos.y - canvas.height / 2;

    worldObjects.forEach(obj => {
        let img;
        ctx.save();
        
        if(obj.tier === "A") {
            // ALTIN BÖLGESİ: Senin görsellerin + Jeneratör için Altın Efekti
            if(obj.kind === "JEN") {
                ctx.filter = "sepia(1) saturate(10) brightness(1.2) drop-shadow(0 0 15px gold)";
                img = imgN.jen;
            } else {
                img = imgA[obj.kind.toLowerCase()];
            }
        } else if(obj.tier === "E") {
            // ELMAS BÖLGESİ: Mavi Parlama Efekti
            ctx.filter = "hue-rotate(180deg) brightness(1.5) drop-shadow(0 0 20px cyan)";
            img = imgN[obj.kind.toLowerCase()];
        } else {
            // NORMAL BÖLGE: Eski gri görseller
            img = imgN[obj.kind.toLowerCase()];
        }

        let size = obj.kind === "JEN" ? 380 : (obj.kind === "KASA" ? 160 : 85);
        if(img && img.complete) {
            ctx.drawImage(img, obj.x - camX, obj.y - camY, size, size);
        }
        ctx.restore();
    });

    updateRadar();
    requestAnimationFrame(draw);
}

// 5. RADAR GÜNCELLEME
function updateRadar() {
    rCtx.clearRect(0,0,180,180);
    
    // Elmas Bölgesi (Merkez Mavi)
    rCtx.fillStyle = "rgba(0, 255, 255, 0.15)";
    rCtx.beginPath(); rCtx.arc(90, 90, (ELMAS_RADIUS/MAP_SIZE)*180, 0, Math.PI*2); rCtx.fill();
    
    // Altın Bölgesi (Sarı Çerçeve)
    rCtx.strokeStyle = "rgba(255, 215, 0, 0.4)";
    rCtx.lineWidth = 2;
    rCtx.beginPath(); rCtx.arc(90, 90, (ALTIN_RADIUS/MAP_SIZE)*180, 0, Math.PI*2); rCtx.stroke();

    // Osman (Beyaz Kare)
    rCtx.fillStyle = "white";
    rCtx.fillRect((pos.x/MAP_SIZE)*180 - 2, (pos.y/MAP_SIZE)*180 - 2, 4, 4);
}

// Başlatıcılar
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

spawnWorld();
draw();
