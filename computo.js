const calc = (max) => {
    const nums = [];
    for (let i = 0; i < max; i++) {
        nums.push(Math.floor(Math.random() * (max - 0 + 1) + 0));
    }

    const obj = [];
    for (let i = 0; i < nums.length; i++) {
        let sum = 0;
        for (let x = 0; x < nums.length; x++) {
            if (nums[i] === nums[x]) {
                sum++;
            }
        }
        obj.push({ [nums[i]]: sum });
    }
    console.log(obj);
    return obj;
};

process.on("message", (msj) => {
    process.send(calc(msj));
});