const MAP_SIZE = 10000;
const CENTER = 5000;
const ELMAS_RADIUS = 1200;
const ALTIN_RADIUS = 3500;

const imgA = {
    para: new Image(),
    disli: new Image(),
    kasa: new Image()
};
imgA.para.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpjNy8OW8lhUhtntVy_-jPuOBWpyLxzXb-tr5NIwpvqg&s=10";
imgA.disli.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgefH-j_ZZP5JOOMPZoGjRRxInLmLVHvM6kovKdjYgDw&s";
imgA.kasa.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl4BxM22-TpThY7qwhHN3wcJ-ddm5yhJgzcrw_-_knnA&s=10";

function getTier(x, y) {
    const dist = Math.hypot(x - CENTER, y - CENTER);
    if (dist < ELMAS_RADIUS) return "E";
    if (dist < ALTIN_RADIUS) return "A";
    return "N";
}

// Çizim fonksiyonunun içindeki mantık:
function drawObject(ctx, obj, camX, camY) {
    const tier = getTier(obj.x, obj.y);
    ctx.save();

    if (tier === "A") {
        if (obj.kind === "JEN") {
            ctx.filter = "sepia(1) saturate(8) brightness(1.2) drop-shadow(0 0 10px gold)";
        } else {
            let img = imgA[obj.kind.toLowerCase()];
            if(img && img.complete) {
                ctx.drawImage(img, obj.x - camX, obj.y - camY, obj.size, obj.size);
                ctx.restore();
                return;
            }
        }
    } else if (tier === "E") {
        ctx.filter = "hue-rotate(180deg) brightness(1.5) drop-shadow(0 0 15px cyan)";
    }

    // Normal veya Efektli Çizim
    ctx.drawImage(imgN[obj.kind.toLowerCase()], obj.x - camX, obj.y - camY, obj.size, obj.size);
    ctx.restore();
}
