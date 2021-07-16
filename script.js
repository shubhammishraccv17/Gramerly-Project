const btn = document.querySelector("#submit-btn");
const customText = document.querySelector("#custom-text")
const input = document.querySelector("#file");
const form = document.querySelector("#form");
const output = document.querySelector("#output");
const message = document.querySelector("#message");
const yourKey = "VLg6XsJZHRWHnn1y";

customText.addEventListener("click", ()=>{
  input.click()
})

input.addEventListener("change", ()=>{
  if(input.value){
    customText.innerHTML = input.value;
  } else {
    customText.innerHTML = "No File Choosen yet!"
  }
})

const fileReader = new FileReader();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.files.length === 0) {
    message.innerHTML = "No File Selected!";
    message.classList.add("message")
    return;
  }

  message.innerHTML = "";
  message.classList.remove("message")
  const inputFile = input.files[0];

  fileReader.readAsText(inputFile, "UTF-8");
  fileReader.onload = async (event) => {
    let value = event.target.result;
    let result = value.replaceAll(" ", "+");

    try {
      const data = await (
        await fetch(
          `https://api.textgears.com/spelling?text=${result}&language=en-GB&whitelist=&dictionary_id=&key=${yourKey}`
        )
      ).json();
      const errors = data.response.errors;

      const badBetterWords = {};
      errors.forEach((error) => {
        badBetterWords[error.bad] = error.better;
      });

      const words = value.split(" ");
      words.forEach((word) => {
        const textBox = document.createElement("span");
        const spanWord = document.createElement("span");
        const spanSuggestionBox = document.createElement("span");
        let isBad = false;

        textBox.classList.add("text");

        if (word in badBetterWords) {
          spanWord.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            spanSuggestionBox.style.display = "block";
          });

          spanSuggestionBox.style.display = "none";
          spanSuggestionBox.classList.add("suggestions");

          spanSuggestionBox.addEventListener("mouseleave", (event)=>{
            spanSuggestionBox.style.display = "none"
          })

          

          isBad = true;
          spanWord.classList.add("span-style")

          const ul = document.createElement("ul");

          badBetterWords[word].forEach((betterWord) => {
            const li = document.createElement("li");
            li.addEventListener("click", (event) => {
              spanWord.innerHTML = betterWord;
              spanWord.classList.remove("span-style");
              spanSuggestionBox.remove();
            });
            li.innerText = betterWord;
            ul.appendChild(li);
          });

          spanSuggestionBox.appendChild(ul);
        }

        spanWord.innerText = word;
        textBox.appendChild(spanWord);
        if (isBad) {
          textBox.appendChild(spanSuggestionBox);
        }
        message.appendChild(textBox);
      });
    } catch (err) {
      message.innerHTML = "Error while reading file!";
      console.log(err);
      return;
    }
  };

  fileReader.onerror = (event) => {
    console.log(event.target.error.name)
    message.innerHTML = "Error while reading file!";
  };

});