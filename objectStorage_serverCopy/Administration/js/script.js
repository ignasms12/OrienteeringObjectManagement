let objects = {};

window.addEventListener('DOMContentLoaded', (event) => {
    initializeApplication();
});
    // spop({
    //     template: 'Įkėlimas sėkmingas',
    //     position  : 'top-right',
    //     style: 'success',
    //     autoclose: 3000
    // });
//378972!

initializeApplication = () => {
    // Get objects
    fetch("/getObjectsAll")
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data.response)
        objects = data.response;
        bindObjectsToView(data.response);
    })
    .catch(error => {
        console.error(error);
    });

    // Get tags
    fetch("/getTags")
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data.response)
        bindTagsToView(data.response, () => {
            addFilteringListeners();
        });

        document.querySelector("#showAllTagsBtn").addEventListener("click", function() {
            document.querySelector(".otherTagsWrapper").classList.remove("dispNone");
            this.classList.add("dispNone");
        });
    })
    .catch(error => {
        console.error(error);
    });

    initializeAutocomplete();
};

initializeAutocomplete = () => {
    document.querySelector("#autocompleteInput").addEventListener("input", function () {
        filterTagsByValue(this.value);
    });
};

filterTagsByValue = (value) => {
    document.querySelectorAll(".mainTagsWrapper .tag, .otherTagsWrapper .tag").forEach(tag => {
        if (!tag.getAttribute("tagname").toLowerCase().includes(value.toLowerCase())) {
            tag.classList.add("dispNone");
        } else {
            tag.classList.remove("dispNone");
        }
    });
};

copyToClipboard = (coords) => {
    var copyObj = document.createElement("textarea");
    copyObj.value = coords;
    document.querySelector("body").appendChild(copyObj);
    let textAreaElem = document.querySelector("textarea");
    textAreaElem.select();
    // copyObj.select();
    document.execCommand("copy");

    // Display that it has been added to clipboard

    textAreaElem.remove();
};

addFilteringListeners = () => {
    document.querySelectorAll(".tag").forEach(tag => {
        tag.addEventListener("click", function() {
            filterByTagName(tag.getAttribute("tagName"));
            document.querySelectorAll(".tag.active").forEach(tag => {
                tag.classList.remove("active");
            });
            document.querySelectorAll(`.tag[tagname=${tag.getAttribute("tagName")}]`).forEach(tag => {
                tag.classList.add("active");
            });
        });
    })
};

filterByTagName = (tagName) => {
    document.querySelectorAll(".objectContainer").forEach(object => {
        object.classList.remove("dispNone");
    });

    objects.forEach(object => {
        let notFoundCounter = 0;
        object.tags.forEach(tag => {
            if (tag != tagName) {
                notFoundCounter++;
            }
        });
        if (notFoundCounter == object.tags.length) {
            document.querySelector("#object_" + object.id).classList.add("dispNone");
        }
    })
};

bindTagsToView = (data, callback) => {
    let counter = 0;

    let tagWrapper = document.querySelector(".tagsSection .mainTagsWrapper");
    let otherTagsWrapper = document.querySelector(".tagsSection .otherTagsWrapper");

    data.forEach(tag => {
        let tagElement = document.createElement("div");
        let spanElement = document.createElement("span");

        tagElement.classList.add("tag");
        tagElement.setAttribute("tagName", tag.tag_name);
        spanElement.innerText = tag.tag_name;

        tagElement.appendChild(spanElement);
        if (tag.tag_count > 1) {
            tagWrapper.appendChild(tagElement);
        } else {
            otherTagsWrapper.appendChild(tagElement);
        }
        counter++;
        if (counter == data.length) {
            callback();
        }
    });
};

bindObjectsToView = (data) => {
    data.forEach(object => {
        let objectContainer = document.createElement("div");
        objectContainer.classList.add("objectContainer");
        objectContainer.id = "object_" + object.id;

        let coordsWrapper = document.createElement("div");
        coordsWrapper.classList.add("coordsWrapper");

        let coordinates = document.createElement("div");
        coordinates.classList.add("coordinates");

        let coordinatesSpan = document.createElement("span");
        let coordsFormatted = object.latitude + ", " + object.longitude;
        coordinatesSpan.innerText = coordsFormatted;
        coordinatesSpan.addEventListener("click", function() {
            copyToClipboard(coordsFormatted);
        });
        // coordinates.setAttribute("onclick", `copyToClipboard(${coordsFormatted})`);

        coordinates.appendChild(coordinatesSpan);
        coordsWrapper.appendChild(coordinates);

        let tagsWrapper = document.createElement("div");
        tagsWrapper.classList.add("tagsWrapper");

        object.tags.forEach(tag => {
            let tagElement = document.createElement("div");
            tagElement.classList.add("tag");
            tagElement.setAttribute("tagName", tag);

            let tagSpan = document.createElement("span");
            tagSpan.innerText = tag;

            tagElement.appendChild(tagSpan);
            tagsWrapper.appendChild(tagElement);
        });

        let imagesWrapper = document.createElement("div");
        imagesWrapper.classList.add("imagesWrapper");

        let infoSpanElement = document.createElement("span");
        let infoContent = `${object.game_date} > ${object.task_number} (${object.id})`;
        infoSpanElement.innerText = infoContent;
        infoSpanElement.style = "position: absolute; color: white;"
        imagesWrapper.appendChild(infoSpanElement);

        if (object.files_ats && object.files_uzd) {
            imagesWrapper.classList.add("dualSetup");

            let singleImageAts = document.createElement("div");
            let singleImageUzd = document.createElement("div");

            singleImageAts.classList.add("singleImage");
            singleImageUzd.classList.add("singleImage");

            singleImageAts.style = `background: url("/${object.files_ats}"); background-repeat: no-repeat; background-position: center; background-size: cover;`;
            singleImageUzd.style = `background: url("/${object.files_uzd}"); background-repeat: no-repeat; background-position: center; background-size: cover;`;

            imagesWrapper.appendChild(singleImageAts);
            imagesWrapper.appendChild(singleImageUzd);
        } else if (object.files_ats || object.files_uzd){
            imagesWrapper.classList.add("singleSetup");

            let singleImage= document.createElement("div");

            singleImage.classList.add("singleImage");

            if (object.files_ats) {
                singleImage.style = `background: url("/${object.files_ats}"); background-repeat: no-repeat; background-position: center; background-size: cover;`;
            } else if (object.files_uzd) {
                singleImage.style = `background: url("/${object.files_uzd}"); background-repeat: no-repeat; background-position: center; background-size: cover;`;
            }

            imagesWrapper.appendChild(singleImage);
        }
    
        objectContainer.appendChild(tagsWrapper);
        objectContainer.appendChild(coordsWrapper);
        objectContainer.appendChild(imagesWrapper);

        document.querySelector(".objects").appendChild(objectContainer);
    });
};