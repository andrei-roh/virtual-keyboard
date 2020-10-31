var shiftElement = {};
var currentPosition = 0;
var rightPart = '';

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },

    properties: {
        value: "",
        capsLock: false,
        shiftKey: false,
        langKey: true,
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard_hidden");
        this.elements.keysContainer.classList.add("keyboard_keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard_key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use_keyboard_input
        document.querySelectorAll(".use_keyboard_input").forEach(element => {
            element.addEventListener("focus", () => {
              setCursorPosition(textarea, currentPosition);
              this.open(element.value, currentValue => {
                currentPosition += 1;
                element.value = currentValue + rightPart;
                element.focus();
                if (rightPart != ''){
                    rightPart = '';
                    currentPosition = textarea.selectionStart;
                    setCursorPosition(textarea, currentPosition);
                    rightPart = element.value.substr(currentPosition);
                    this.properties.value = element.value.substr(0, currentPosition);
                    setCursorPosition(textarea, currentPosition);
                }
              });

              textarea.addEventListener("click", () => {
                currentPosition = textarea.selectionStart;
                setCursorPosition(textarea, currentPosition);
                rightPart = element.value.substr(currentPosition);
                this.properties.value = element.value.substr(0, currentPosition);
                setCursorPosition(textarea, currentPosition);
              });

              textarea.addEventListener("keypress", () => {
                currentPosition = textarea.selectionStart;
                setCursorPosition(textarea, currentPosition);
                rightPart = element.value.substr(currentPosition);
                this.properties.value = element.value.substr(0, currentPosition);
                setCursorPosition(textarea, currentPosition);
              });
            });
        });

        //Set cursor position
        function setCursorPosition(textarea, currentPosition) {

          if(textarea.setSelectionRange) {
              textarea.focus();
              textarea.setSelectionRange(currentPosition, currentPosition);
          }
          else if(textarea.createTextRange) {
              var range = textarea.createTextRange();
              range.collapse(true);
              range.moveEnd('character', currentPosition);
              range.moveStart('character', currentPosition);
              range.select();
          }
        }
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayoutEn = [
            // ["`", "~"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"],
            // ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], "backspace",
             "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
            "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "done", "space", "arrow_left", "arrow_right", "en"
        ];
        const keyLayoutRu = [
            // ["`", "~"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"],
            // ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], "backspace",
            "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
            "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
            "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
            "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "?",
            "done", "space", "arrow_left", "arrow_right", "ru"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        //Check language
        let currentLanguage;
        if (this.properties.langKey) {
          currentLanguage = keyLayoutEn;
        }
        else {
          currentLanguage = keyLayoutRu;
        }

        currentLanguage.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "]", "ъ", "enter", "?"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard_key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard_key_wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        currentPosition -= 1;
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard_key_wide", "keyboard_key_activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard_key_active", this.properties.capsLock);
                    });

                    break;

                case "shift":
                    keyElement.classList.add("keyboard_key_wide", "keyboard_key_activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_up");

                    keyElement.addEventListener("click", () => {
                        this._toggleShift();
                        keyElement.classList.toggle("keyboard_key_active", this.properties.shiftKey);
                        shiftElement = keyElement;

                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard_key_wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        currentPosition += 1;
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard_key_extrawide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        currentPosition += 1;
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "done":
                    keyElement.classList.add("keyboard_key_wide", "keyboard_key_dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });

                    break;

                case "arrow_left":
                    keyElement.classList.add("keyboard_key_wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_left");

                    keyElement.addEventListener("click", () => {
                      this._toggleLeft();
                      this._triggerEvent("oninput");
                    });

                    break;

                case "arrow_right":
                    keyElement.classList.add("keyboard_key_wide");
                    keyElement.innerHTML = createIconHTML("keyboard_arrow_right");

                    keyElement.addEventListener("click", () => {
                      this._toggleRight();
                      this._triggerEvent("oninput");
                    });

                    break;

                case "en":
                    keyElement.innerText = 'en';
                    keyElement.addEventListener('click', () => {
                      this._toggleLang();
                      this._triggerEvent("oninput");
                    });

                    break;

                  case "ru":
                    keyElement.innerText = 'ru';
                    keyElement.addEventListener('click', () => {
                      this._toggleLang();
                      this._triggerEvent("oninput");
                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    //Shift key
                    keyElement.addEventListener("click", () => {
                      if (this.properties.shiftKey) {
                        if (!this.properties.capsLock) {
                          this.properties.capsLock = false;
                          this.properties.value += key.toUpperCase()
                          this._turnOffShift();
                          shiftElement.classList.toggle('keyboard_key_active', this.properties.shiftKey);
                          this.properties.shiftKey = true;
                        }
                        else {this.properties.capsLock = false;
                          this.properties.value += key.toLowerCase()
                          this._turnOffShift();
                          shiftElement.classList.toggle('keyboard_key_active', this.properties.shiftKey);
                          this.properties.shiftKey = true;
                        }
                      };
                      if (this.properties.capsLock) {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                      }
                      if (!this.properties.shiftKey && !this.properties.capsLock) {
                        this.properties.value += key.toLowerCase()
                      }

                      this._triggerEvent("oninput");
                      this.properties.shiftKey = false;
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
              key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _toggleShift() {
        this.properties.shiftKey = !this.properties.shiftKey;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
              key.textContent = this.properties.shiftKey ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
      },

    _turnOffShift() {
        this.properties.shiftKey = !this.properties.shiftKey;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.shiftKey ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
      },

    _toggleLeft() {
      currentPosition = currentPosition - 1 >= 0 ? currentPosition - 1 : 0;
      textarea.selectionStart = currentPosition;
      textarea.focus();
      textarea.setSelectionRange(currentPosition, currentPosition);
      rightPart = this.properties.value.substr(currentPosition)
      this.properties.value = this.properties.value.substr(0, currentPosition);
    },

    _toggleRight() {
      currentPosition += 1;
      textarea.selectionStart = currentPosition;
      textarea.focus();
      textarea.setSelectionRange(currentPosition, currentPosition);
      rightPart = this.properties.value.substr(currentPosition)
      this.properties.value = this.properties.value.substr(0, currentPosition);
    },

    _toggleLang() {
      this.properties.langKey = !this.properties.langKey;
      this.properties.shiftKey = !this.properties.shiftKey;

      while (this.elements.keysContainer.children.length > 0) this.elements.keysContainer.children[0].remove();
      this.elements.keysContainer.appendChild(this._createKeys());
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard_key");
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard_hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard_hidden");
    },
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});
