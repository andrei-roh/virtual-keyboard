var shiftElement = {};
var currentPosition = 0;

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
        shiftKey: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "1keyboard_hidden");
        this.elements.keysContainer.classList.add("keyboard_keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard_key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use_keyboard_input
        document.querySelectorAll(".use_keyboard_input").forEach(element => {

            element.addEventListener("focus", () => {
              setCaretPosition(textarea, currentPosition);
                this.open(element.value, currentValue => {
                    currentPosition += 1;
                    textarea.value = currentValue;
                    element.focus();
                });
                element.addEventListener("click", () => {
                  currentPosition = textarea.selectionStart;
                });
            });
            element.addEventListener("keydown", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                    element.focus();
                });
            });
        });

        //Set cursor position
        function setCaretPosition(ctrl, position) {
          if(ctrl.setSelectionRange) {
              ctrl.focus();
              ctrl.setSelectionRange(position, position);
          }
          else if (ctrl.createTextRange) {
              var range = ctrl.createTextRange();
              range.collapse(true);
              range.moveEnd('character', position);
              range.moveStart('character', position);
              range.select();
          }
        }
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "done", "space", "arrow_left", "arrow_right"
        ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard_key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard_key_wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
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
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard_key_extrawide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
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

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                      if (this.properties.shiftKey) {
                        if (!this.properties.capsLock){
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
                      if(!this.properties.shiftKey && !this.properties.capsLock){
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
    },

    _toggleRight() {
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
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});
