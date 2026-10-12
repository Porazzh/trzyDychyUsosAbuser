(() => {
  const answers = [
    "68-100 %",
    "tak",
    "tak",
    "tak",
    "tak",
    "zdecydowanie się zgadzam",
    "zdecydowanie się zgadzam",
    "zdecydowanie się zgadzam",
    "zdecydowanie się zgadzam",
    "zdecydowanie się zgadzam",
    "zdecydowanie się zgadzam",
  ];

  const delay = 10;
  
  const submitBtn = document.querySelector('input[value="Zapisz odpowiedzi"]');

  const norm = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\s*%\s*/g, "%")
      .trim();

  const labelOf = (input) => {
    if (input.id) {
      const l = document.querySelector(`label[for="${CSS.escape(input.id)}"]`);
      if (l) return l.textContent;
    }
    const wrap = input.closest("label");
    if (wrap) return wrap.textContent;
    const parent = input.parentElement;
    return parent ? parent.textContent : "";
  };

  const radios = [...document.querySelectorAll('input[type="radio"]')];
  const groups = new Map();
  for (const r of radios) {
    const name = r.name || "";
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(r);
  }

  const questionGroups = [...groups.values()];

  const click = (input) => {
    input.click();
    input.checked = true;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };

  let i = 0;
  const step = () => {
    if (i >= answers.length) {
      console.log("Gotowe - zaznaczono wszystkie opcje.");
      submitBtn.click();
      return;
    }
    const want = norm(answers[i]);
    const group = questionGroups[i];
    if (!group) {
      console.warn(`Pytanie #${i + 1}: brak grupy radio (szukano "${answers[i]}")`);
      i++;
      return step();
    }
    const target = group.find((r) => {
      const t = norm(labelOf(r));
      return t === want || t.includes(want) || want.includes(t);
    });
    if (target) {
      click(target);
      console.log(`Pytanie #${i + 1}: kliknięto "${answers[i]}"`);
    } else {
      console.warn(`Pytanie #${i + 1}: nie znaleziono opcji "${answers[i]}"`);
    }
    i++;
    setTimeout(step, delay);
  };

  step();
})();
