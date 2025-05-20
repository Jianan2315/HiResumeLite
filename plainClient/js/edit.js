window.addEventListener("load", function () {
    localStorage.setItem('templateId', "1");

    if (localStorage.getItem("restore")){
        console.log("Restore content exists.");
    }

    if (!localStorage.getItem("restore")){
        localStorage.removeItem("restore");
    } else {
        console.log("Pass.");
    }

    bindFunctions();
});

function bindFunctions() {
    bindDeleteBlock(); // Bind trash icon with delete function
    bindAddFunction(); // Bind all add buttons with add function
    bindUpdateFunction(); // Bind update function
    bindSectionFunction(); // Bind move up/down function for each section
    addBulletToExp(); // Add bullets in exp-like section
}
function cancelEntry() {
    const formContainer = document.getElementById("form-container");
    formContainer.classList.add("form-container-hidden");
    showPreview();
}
function deleteItem(icon) {
    const block = icon.parentElement;
    block.remove();
    cancelEntry();
}

// bind functions
function bindAddFunction(){
    const addButtons = document.querySelectorAll(".add-button");
    addButtons.forEach(button => {
        button.addEventListener("click", function() {
            hidePreview();
            const type = button.parentElement.dataset.type;
            if (type === "edu"){
                addEducation(this);
            } else if (type === "skill"){
                addSkill(this);
            } else if (type === "exp"){
                addExp(this);
            } else {
                console.error("bindAddFunction(): Invalid type.")
            }
        });
    });
}
function bindDeleteBlock(){
    for (let _id of [".trash-icon-edu", ".trash-icon-skill", ".trash-icon-exp"]){
        document.querySelectorAll(_id).forEach((icon)=>{
            const block = icon.parentElement;
            if (block) {
                icon.addEventListener("click", function(e) {
                    e.stopPropagation(); // not necessary but in case
                    deleteItem(this);
                });
                block.addEventListener('mouseenter', () => {
                    icon.classList.add('icon-visible');
                });
                block.addEventListener('mouseleave', () => {
                    icon.classList.remove('icon-visible');
                });
            } else {
                console.error('Error: Cannot access parent element of ', icon);
            }
        });
    }
}
function bindUpdateFunction() {
    for (let type of ["info", "edu", "skill", "exp"]){
        const sections = document.querySelectorAll("."+type+"-section");
        sections.forEach(section => {
            let sectionTitle = null;
            if (type !== "info"){
                sectionTitle = section.querySelector("h2");
                sectionTitle.addEventListener('click', ()=> fillSectionName(sectionTitle));
            }
            const ulBlocks = section.querySelectorAll(".component ul");
            ulBlocks.forEach(ulBlock => {
                ulBlock.addEventListener('click', ()=> fillForm(ulBlock, type));
            });
        });
    }
}
function bindSectionFunction(){ // bind operations for each section inside preview container
    const preview = document.querySelector("#resume-preview");
    const sections = preview.querySelectorAll("section:not([data-type=\"info\"])");
    sections.forEach(section => {
        const title =  section.querySelector("h2");
        const up = section.querySelector(".fa-up-long");
        const down = section.querySelector(".fa-down-long");
        const plus = section.querySelector(".fa-square-plus");
        const minus = section.querySelector(".fa-square-minus");
        title.addEventListener('mouseenter', () => {
            for (let x of [up, down, plus, minus]) {
                x.classList.add('icon-visible');
            }
        });
        title.addEventListener('mouseleave', () => {
            for (let x of [up, down, plus, minus]) {
                x.classList.remove('icon-visible');
            }
        });
        up.addEventListener("click", function (e){
            e.stopPropagation();
            const current = this.closest("section");
            const prev = current.previousElementSibling;
            if (prev && prev.dataset.type !== "info") {
                current.parentElement.insertBefore(current, prev);
            }
        });
        down.addEventListener("click", function (e){
            e.stopPropagation();
            const current = this.closest("section");
            const next = current.nextElementSibling;
            if (next) {
                current.parentElement.insertBefore(next, current);
            }
        });
        plus.addEventListener("click", function (e){
            e.stopPropagation();
            const current = this.closest("section");
            const clone = current.cloneNode(true);  // deep copy (includes children)
            current.parentElement.appendChild(clone);
            bindFunctions();
        });
        minus.addEventListener("click", function(e){
            e.stopPropagation();
            const current = this.closest("section");
            current.remove();
        });
    });
}
function addBulletToExp(){
    const ulBlocks = document.querySelectorAll('.exp-section ul');
    ulBlocks.forEach((ulBlock) => {
        ulBlock.querySelectorAll("li").forEach((li, index) => {
            if (index > 1) {
                li.style.listStyleType = 'disc';
            }
        })
    });
}

function hidePreview() {
    const right = document.getElementById('preview-container');
    const screenWidth = window.innerWidth;
    if (screenWidth <= 1024) {
        right.style.display = 'none';
    }
}
function showPreview() {
    const right = document.getElementById('preview-container');
    const screenWidth = window.innerWidth;

    if (screenWidth <= 1024) {
        right.style.display = 'block';
    }
}

function adjustHeight(textarea) { // Helper function to adjust height
    textarea.style.height = 'auto'; // Reset height
    void textarea.offsetHeight; // Trigger reflow
    const scrollHeight = textarea.scrollHeight; // Get the actual content height

    // Get the computed line height or fallback to font size
    let lineHeight = getComputedStyle(textarea).lineHeight;
    if (lineHeight === 'normal') {
        const fontSize = parseFloat(getComputedStyle(textarea).fontSize);
        lineHeight = fontSize * 1.2; // Approximate default multiplier for "normal"
    } else {
        lineHeight = parseFloat(lineHeight); // Convert to numeric
    }

    const maxHeight = lineHeight * 6; // Max height for 6 rows
    const finalHeight = Math.min(scrollHeight, maxHeight);
    textarea.style.height = `${finalHeight}px`;
}
function adjustTextarea(form) {
    const textareas = form.querySelectorAll('textarea');

    // Adjust each textarea
    textareas.forEach(textarea => {
        adjustHeight(textarea); // Adjust for pre-filled content
        textarea.addEventListener('input', function () {
            adjustHeight(this); // Adjust dynamically on input
        });
    });
}

// Add entries
function parseStringToDateObject(str) {
    return new Date("1 " + str);  // Always use `new`
}
function addEduEntry(saveButton, addButton) {
    // Get form input values
    const form = saveButton.parentElement;
    const college = form.querySelector("#university").value;
    const gradDate = form.querySelector("#graduation").value;
    const major = form.querySelector("#major").value;

    if (!college || !gradDate) {
        alert("Please fill in all fields.");
        return;
    }

    // Parse graduation date
    const [year, month, day] = gradDate.split("-").map(Number);
    const gradDateObj = new Date(year, month-1, day);
    const list = addButton.previousElementSibling;
    const dateString = gradDateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="component">
            <ul>
                <li><strong>${college}</strong><span>${dateString}</span></li>
                <li>${major}</li>
            </ul>
            <i class="fa-solid fa-trash trash-icon-edu"></i>
        </div>`

    list.appendChild(wrapper.firstElementChild);
    const components = Array.from(list.querySelectorAll(".component"));

    //  Sort in descending order
    components.sort((a, b) => {
        const dateA = parseStringToDateObject(a.querySelector("span").textContent.trim());
        const dateB = parseStringToDateObject(b.querySelector("span").textContent.trim());
        return dateB - dateA;
    });

    // Re-append in sorted order
    components.forEach(c => list.appendChild(c));

    bindDeleteBlock();
    bindUpdateFunction(); // Not good but simple way. Save my mind.
    cancelEntry();
}
function addEducation(addButton) {
    const form = popEduForm();
    form.querySelector('#add-edu-entry').addEventListener('click', function() {
        addEduEntry(this, addButton);
    });
    form.querySelector('#cancel-edu-entry').addEventListener('click', function() {
        cancelEntry();
    });
}
function addSkillEntry(saveButton, addButton) {
    const form = saveButton.parentElement;
    const name = form.querySelector("#new-skill-name").value;
    const detail = form.querySelector("#new-skill-detail").value;

    if (!name || !detail) {
        alert("Please fill in all fields.");
        return;
    }

    const list = addButton.previousElementSibling;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="component">
            <ul>
                <li><strong>${name}</strong>: <span>${detail}</span></li>
            </ul>
            <i class="fa-solid fa-trash trash-icon-skill"></i>
        </div>`

    list.appendChild(wrapper.firstElementChild);

    bindDeleteBlock();
    bindUpdateFunction();
    cancelEntry();
}
function addSkill(addButton) {
    const form = popSkillForm();
    form.querySelector('#add-skill-entry').addEventListener('click', function() {
        addSkillEntry(this, addButton);
    });
    form.querySelector('#cancel-skill-entry').addEventListener('click', function() {
        cancelEntry();
    })
}
function parseEndDate(component) {
    const dateText = component.querySelector("em").textContent;
    const match = dateText.match(/-\s*([A-Za-z]{3} \d{4})/); // Extract "Jul 2024"

    return new Date("1 " + match[1]);  // "1 Jul 2024"
}
function addExpEntry(saveButton, addButton) {
    const form = saveButton.parentElement;
    const company = form.querySelector("#company").value;
    const title = form.querySelector("#title").value;
    const orgAddress = form.querySelector("#org-address").value;
    const start = form.querySelector("#start").value;
    const end = form.querySelector("#end").value;
    const exp = form.querySelector("#exp").value;
    const vals=[company,title,orgAddress,start,end,exp]

    for (let val of vals) {
        if (!val) {
            alert("Please fill in all fields.");
            return;
        }
    }

    const [syear, smonth, sday] = start.split("-").map(Number);
    const startDateObj = new Date(syear,smonth-1, sday);
    const [eyear, emonth, eday] = end.split("-").map(Number);
    const endDateObj = new Date(eyear, emonth-1, eday);

    const list = addButton.previousElementSibling;
    const startDate = startDateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
    const endDate = endDateObj.toLocaleString('default', { month: 'short', year: 'numeric' });
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="component">
            <ul>
                <li><strong>${company}, ${title}</strong></li>
                <li><strong><em>${orgAddress} | ${startDate} - ${endDate}</em></strong></li>
                ${exp.split('\n')
        .map(line => line.trim().replace(/^•\s*/, ''))
        .filter(line => line.length > 0)
        .map(line => `<li>${line}</li>`)
        .join('\n')}
            </ul>
            <i class="fa-solid fa-trash trash-icon-exp"></i>
        </div>`

    list.appendChild(wrapper.firstElementChild);
    const components = Array.from(list.querySelectorAll(".component"));

    // Sort by end date descending
    components.sort((a, b) => parseEndDate(b) - parseEndDate(a));

    // Re-append in sorted order
    components.forEach(comp => list.appendChild(comp));

    addBulletToExp();
    bindDeleteBlock();
    bindUpdateFunction();
    cancelEntry();
}
function addExp(addButton) {
    const form = popExpForm();
    form.querySelector('#add-exp-entry').addEventListener('click', function() {
        addExpEntry(this, addButton);
    });
    form.querySelector('#cancel-exp-entry').addEventListener('click', function() {
        cancelEntry();
    });
}

// Update Entries
function updateSectionName(saveButton, sectionTitle){
    const form = saveButton.parentElement;
    const name = form.querySelector("#section").value;

    if (!name) {
        alert("Please fill the module name.");
        return;
    }

    sectionTitle.querySelector("span").innerText = name;

    cancelEntry();
}
function updateInfoEntry(saveButton, ulBlock){
    const divBlock = ulBlock.parentElement;
    const list = divBlock.parentElement;
    divBlock.remove();

    const form = saveButton.parentElement;
    const name = form.querySelector("#name").value;
    const phone = form.querySelector("#phone").value;
    const email = form.querySelector("#email").value;
    const location = form.querySelector("#location").value;

    if (!name || !phone || !email || !location) {
        alert("Please fill in all fields.");
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="component">
            <ul>
                <li><strong>${name}</strong></li>
                <li><p> Phone: ${phone} | Email: ${email} | Location: ${location}</p></li>
            </ul>
        </div>`

    list.appendChild(wrapper.firstElementChild);
    bindUpdateFunction(); // Not good but simple way. Save my mind.
    cancelEntry();
}
function updateEduEntry(saveButton, ulBlock){
    const addButton = ulBlock.closest('section').querySelector('.add-button');
    const divBlock = ulBlock.parentElement;
    divBlock.remove();
    addEduEntry(saveButton, addButton);
}
function updateSkillEntry(saveButton, ulBlock){
    const addButton = ulBlock.closest('section').querySelector('.add-button');
    const divBlock = ulBlock.parentElement;
    divBlock.remove();
    addSkillEntry(saveButton, addButton);
}
function updateExpEntry(saveButton, ulBlock){
    const addButton = ulBlock.closest('section').querySelector('.add-button');
    const divBlock = ulBlock.parentElement;
    divBlock.remove();
    addExpEntry(saveButton, addButton);
}

function popSectionName(){
    const form = document.getElementById("resume-form");
    const formContainer = document.getElementById("form-container")
    formContainer.classList.remove("form-container-hidden")
    form.innerHTML = `
        <label for="section">Section Name:</label>
        <input type="text" id="section" name="section">
        <button type="button" id="update-section-name">Save</button>
        <button type="button" id="cancel-section-name">Cancel</button>
    `;
    return form;
}
function popInfoForm(){
    const form = document.getElementById("resume-form");
    const formContainer = document.getElementById("form-container")
    formContainer.classList.remove("form-container-hidden")
    form.innerHTML = `
        <label for="name">Name:</label>
        <input type="text" id="name" name="name">
        <label for="phone">Phone:</label>
        <input type="text" id="phone" name="phone">
        <label for="email">Email:</label>
        <input type="text" id="email" name="email">
        <label for="location">Location:</label>
        <input type="text" id="location" name="location">
        <button type="button" id="update-info-entry">Save</button>
        <button type="button" id="cancel-info-entry">Cancel</button>
    `;
    return form;
}
function popEduForm(){
    const form = document.getElementById("resume-form");
    const formContainer = document.getElementById("form-container")
    formContainer.classList.remove("form-container-hidden")
    form.innerHTML = `
        <label for="university">University:</label>
        <textarea id="university" name="university"></textarea>
        <label for="graduation">(Expected) Graduation Year:</label>
        <input type="date" id="graduation" name="graduation">
        <label for="major">Major:</label>
        <textarea id="major" name="major"></textarea>       
        <button type="button" id="add-edu-entry">Save</button>
        <button type="button" id="cancel-edu-entry">Cancel</button>
    `;
    return form;
}
function popSkillForm(){
    const form = document.getElementById("resume-form");
    const formContainer = document.getElementById("form-container")
    formContainer.classList.remove("form-container-hidden")
    form.innerHTML = `
        <label for="new-skill-name">Skill name:</label>
        <textarea id="new-skill-name" name="new-skill-name"></textarea>
         <label for="new-skill-detail">Skill details:</label>
        <textarea id="new-skill-detail" name="new-skill-detail"></textarea>
        
        <button type="button" id="add-skill-entry">Save</button>
        <button type="button" id="cancel-skill-entry">Cancel</button>
    `;
    return form;
}
function addBullet(lines) {
    const values=lines.value.split("\n").map(line => line.startsWith("•")?line:`•${line}`);
    lines.value=values.join("\n");
}
function popExpForm(){
    const form = document.getElementById("resume-form");
    const formContainer = document.getElementById("form-container")
    formContainer.classList.remove("form-container-hidden")
    form.innerHTML = `
        <label for="company">Company:</label>
        <input type="text" id="company" name="company">
        <label for="title">Position Title:</label>
        <input type="text" id="title" name="title">
        <label for="org-address">Location:</label>
        <textarea id="org-address" name="org-address"></textarea>
        <label for="start">Start Date:</label>
        <input type="date" id="start" name="start">
        <label for="end">End Date:</label>
        <input type="date" id="end" name="end">
        <label for="exp">Experience:</label>
        <textarea id="exp" name="exp" oninput="addBullet(this)"></textarea>
        
        <button type="button" id="add-exp-entry">Save</button>
        <button type="button" id="cancel-exp-entry">Cancel</button>
    `;
    return form;
}

function fillSectionName(sectionTitle){
    const form = popSectionName();
    form.querySelector("#section").value = sectionTitle.querySelector("span").innerText.trim();

    adjustTextarea(form);

    form.querySelector('#update-section-name').addEventListener('click', function() {
        updateSectionName(this, sectionTitle);
    });
    form.querySelector('#cancel-section-name').addEventListener('click', function() {
        cancelEntry();
    });
}
function fillInfoForm(ulBlock){
    const form = popInfoForm();
    const liItems = ulBlock.querySelectorAll('li');
    form.querySelector("#name").value = liItems[0].innerText.trim();
    const [phone,email,location]= liItems[1].innerText.split("|").map(piece=>piece.split(":")[1].trim());
    form.querySelector("#phone").value = phone;
    form.querySelector("#email").value = email;
    form.querySelector("#location").value = location;

    adjustTextarea(form);

    form.querySelector('#update-info-entry').addEventListener('click', function() {
        updateInfoEntry(this, ulBlock);
    });
    form.querySelector('#cancel-info-entry').addEventListener('click', function() {
        cancelEntry();
    });
}
function parseStringToFormDate(dateString){ //Jul 2023
    return new Date("1 "+dateString).toISOString().split('T')[0];
}
function fillEducationForm(ulBlock) {
    const form = popEduForm();
    const liItems = ulBlock.querySelectorAll('li');
    form.querySelector("#university").value = liItems[0].querySelector("strong").innerText.trim();
    const dateText = liItems[0].querySelector('span').innerText.trim();
    form.querySelector("#graduation").value = parseStringToFormDate(dateText);
    form.querySelector("#major").value = liItems[1].innerText.trim();

    adjustTextarea(form);

    form.querySelector('#add-edu-entry').addEventListener('click', function() {
        updateEduEntry(this, ulBlock);
    });
    form.querySelector('#cancel-edu-entry').addEventListener('click', function() {
        cancelEntry();
    });
}
function fillSkillForm(ulBlock) {
    const form = popSkillForm();
    const liItem = ulBlock.querySelector('li');
    form.querySelector("#new-skill-name").value = liItem.querySelector("strong").innerText.trim();
    form.querySelector("#new-skill-detail").value = liItem.querySelector("span").innerText.trim();

    adjustTextarea(form);

    form.querySelector('#add-skill-entry').addEventListener('click', function() {
        updateSkillEntry(this, ulBlock);
    });
    form.querySelector('#cancel-skill-entry').addEventListener('click', function() {
        cancelEntry();
    });
}
function fillExperienceForm(ulBlock) {
    const form = popExpForm();
    const liItems = ulBlock.querySelectorAll('li');

    form.querySelector("#company").value = liItems[0].innerText.split(",")[0].trim();
    form.querySelector("#title").value = liItems[0].innerText.split(",")[1].trim();
    form.querySelector("#org-address").value = liItems[1].innerText.split("|")[0].trim();

    const start = liItems[1].innerText.split("|")[1].split("-")[0].trim();
    const end = liItems[1].innerText.split("|")[1].split("-")[1].trim();
    form.querySelector("#start").value = parseStringToFormDate(start);
    form.querySelector("#end").value = parseStringToFormDate(end);

    let bullets = [];
    for (let i = 2; i < liItems.length; i++) {
        bullets.push("• " + liItems[i].innerText.trim());
    }
    form.querySelector("#exp").value = bullets.join('\n');

    adjustTextarea(form);

    form.querySelector('#add-exp-entry').addEventListener('click', function() {
        updateExpEntry(this, ulBlock);
    });
    form.querySelector('#cancel-exp-entry').addEventListener('click', function() {
        cancelEntry();
    });
}
function fillForm(ulBlock, type) {
    if (type === "info"){
        ulBlock.addEventListener('click', ()=> fillInfoForm(ulBlock));
    } else if (type === "edu") {
        ulBlock.addEventListener('click', () => fillEducationForm(ulBlock));
    } else if (type === "skill") {
        ulBlock.addEventListener('click', () => fillSkillForm(ulBlock));
    } else {
        ulBlock.addEventListener('click', () => fillExperienceForm(ulBlock));
    }
}

function extractResumeData() {
    const data = {
        info: {}
    };

    // Extract static info
    const infoItems = document.querySelectorAll(".info-section li");
    data.info.name = infoItems[0]?.innerText.trim();
    data.info.detail = infoItems[1]?.innerText.trim();

    // Preserve order by extracting visible section titles
    const preview = document.querySelector("#resume-preview");
    const sections = preview.querySelectorAll("section:not([data-type=\"info\"])");
    sections.forEach(section => {
        const title = section.querySelector("h2 span").innerText.trim();
        const type = section.dataset.type;
        const listContainer = section.querySelector(":scope > div");

        const sectionObject = {type:type};
        listContainer.querySelectorAll(".component").forEach((component, index) => {
            if (type === "edu") {
                const liItems = component.querySelectorAll("li");
                const block = {};
                block.university = liItems[0].querySelector("strong").innerText.trim();
                block.lastmonth = liItems[0].querySelector("span").innerText.trim();
                block.major = liItems[1].innerText.trim();
                sectionObject[index] = block;
            } else if (type === "skill") {
                const liItem = component.querySelector("li");
                const block = {};
                block.name = liItem.querySelector("strong").innerText.trim();
                block.detail = liItem.querySelector("span").innerText.trim();
                sectionObject[index] = block;
            } else if (type === "exp") {
                const liItems = component.querySelectorAll("li");
                const block = {};
                block.org = liItems[0].innerText.trim();
                block.loc = liItems[1].innerText.trim();
                block.work = Array.from(liItems).slice(2).map(liItem=> liItem.innerText.trim());
                sectionObject[index] = block;
            } else {
                console.error("extractResumeData(): Invalid type.");
            }
        });

        data[title] = sectionObject;
    });

    return data;
}
// stringify data then save as local json file
function saveAsJSON(data, filename = "resume.json") {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
// restore from parsed json
function restoreResumeFromJSON(data) {
    // Restore Info
    const info = data.info;
    document.querySelector(".info-section > div").innerHTML = `
        <div class="component">
          <ul>
            <li><strong>${info.name}</strong></li>
            <li><p>${info.detail}</p></li>
          </ul>
        </div>
    `;

    const sections = document.querySelectorAll("section[data-type]:not([data-type=\"info\"])");
    const preview = document.querySelector("#resume-preview");
    sections.forEach(section => {
        section.remove();
    });

    for (const [title, sectionObject] of Object.entries(data)) {
        if (title === "info") continue;

        const type = sectionObject.type;
        const len = Object.keys(sectionObject).length;
        const list = [];
        if (type === "edu") {
            for (let i = 0; i < len-1; i++) {
                const block = sectionObject[i];
                const divContent = `
                    <div class="component">
                        <ul>
                            <li><strong>${block.university}</strong><span>${block.lastmonth}</span></li>
                            <li>${block.major}</li>
                        </ul>
                        <i class="fa-solid fa-trash trash-icon-edu"></i>
                    </div>
                `
                list.push(divContent);
            }
            const outer = document.createElement("div");
            outer.innerHTML = `
                <section class="edu-section" data-type="edu">
                    <h2><span>${title}</span><i class="fa-regular fa-square-plus"></i><i class="fa-regular fa-square-minus"></i><i class="fa-solid fa-up-long"></i><i class="fa-solid fa-down-long"></i></h2>
                    <div>
                    </div>
                    <div class="add-button">+</div>
                </section>
            `;
            const section = outer.firstElementChild;
            section.querySelector("div").innerHTML = list.join("");
            preview.appendChild(section);
        } else if (type === "skill") {
            for (let i = 0; i < len-1; i++) {
                const block = sectionObject[i];
                const divContent = `
                    <div class="component">
                        <ul>
                            <li><strong>${block.name}</strong>: <span>${block.detail}</span></li>
                        </ul>
                        <i class="fa-solid fa-trash trash-icon-skill"></i>
                    </div>
                `
                list.push(divContent);
            }
            const outer = document.createElement("div");
            outer.innerHTML = `
                <section class="skill-section" data-type="skill">
                    <h2><span>${title}</span><i class="fa-regular fa-square-plus"></i><i class="fa-regular fa-square-minus"></i><i class="fa-solid fa-up-long"></i><i class="fa-solid fa-down-long"></i></h2>
                    <div>
                    </div>
                    <div class="add-button">+</div>
                </section>
            `;
            const section = outer.firstElementChild;
            section.querySelector("div").innerHTML = list.join("");
            preview.appendChild(section);
        } else if (type === "exp") {
            for (let i = 0; i < len-1; i++) {
                const block = sectionObject[i];
                const divContent = `
                        <div class="component">
                            <ul>
                                <li><strong>${block.org}</strong></li>
                                <li><strong><em>${block.loc}</em></strong></li>
                                ${block.work.map(item => `<li>${item}</li>`).join("")}
                            </ul>
                            <i class="fa-solid fa-trash trash-icon-exp"></i>
                        </div>
                `
                list.push(divContent);
            }
            const outer = document.createElement("div");
            outer.innerHTML = `
                <section class="exp-section" data-type="exp">
                    <h2><span>${title}</span><i class="fa-regular fa-square-plus"></i><i class="fa-regular fa-square-minus"></i><i class="fa-solid fa-up-long"></i><i class="fa-solid fa-down-long"></i></h2>
                    <div>
                    </div>
                    <div class="add-button">+</div>
                </section>
            `;
            const section = outer.firstElementChild;
            section.querySelector("div").innerHTML = list.join("");
            preview.appendChild(section);
        } else {
            console.error("extractResumeData(): Invalid type.");
        }
    }

    bindFunctions();
}

// functions: download json, import json, download/print resume
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("restore")) {
        document.body.innerHTML = localStorage.getItem("restore");
    }

    const icons = document.getElementById("head-icons")
    const importButton = icons.querySelector("#import-icon");
    const saveButton = icons.querySelector("#save-icon");
    const printButton = icons.querySelector("#print-icon");

    saveButton.addEventListener("click", ()=>{
        const resumeData = extractResumeData();
        saveAsJSON(resumeData);
    });

    printButton.addEventListener("click", ()=>{
        const originalContent = document.body.innerHTML;
        const printElement = document.getElementById('resume-preview');
        printElement.style.width = "100%";
        printElement.style.margin = "0";
        printElement.style.padding = "0";

        document.body.innerHTML = printElement.outerHTML; // outerHTML: string of DOM element object
        document.querySelectorAll(".add-button").forEach(button => {
            button.style.display="none";
        });

        window.print();
        document.body.innerHTML = originalContent; // Restore original content
        localStorage.setItem("restore", originalContent);
        location.reload(); // Reload the page to restore event bindings
    });

    const jsonInput = document.getElementById("upload-json");
    jsonInput.addEventListener("change", function() {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function()  {
            try {
                const jsonData = JSON.parse(this.result);
                console.log("Loaded JSON:", jsonData);
                restoreResumeFromJSON(jsonData);
            } catch (err) {
                alert("Invalid JSON file.");
                console.error(err);
            }
        };

        reader.readAsText(file);
    });
    importButton.addEventListener("click", () => {
        jsonInput.click();
    });
});