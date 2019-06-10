const exampleOne = document.getElementById("exampleOne");
const exampleTwo = document.getElementById("exampleTwo");
const exampleThree = document.getElementById("exampleThree");

const yourFormula = document.getElementById("formula");
const yourExample = document.getElementById("exampleOne");

function molecularStructure(formula) {
  //regular expressions to search pattern
  // for opener brackets
  const openBrackets = /\[|\{|\(/;
  // for closer brackets
  const closeBrackets = /\]|\}|\)/;
  // for valid atom
  const atomValid = /^[A-Z][a-z]?$/;
  // for multiplier (d+ to find digits)
  const multipliers = /^\d+/;

  // function for creating group
  function groupCreate(parent = {}) {
    return { atomsObj: {}, groupsArr: [], multiplier: 1, parent };
  }

  // function for extracting group
  function groupsExtracting(chem) {
    const groupCollection = groupCreate();
    let currGroup = groupCollection;

    for (let i = 0; i < chem.length; i++) {
      const currChar = chem[i];
      let isCloser = false;
      let atom;
      let multiplier = 1;

      // testing patterns with test() method
      if (openBrackets.test(currChar)) {
        // level down
        const groupParent = currGroup;
        currGroup = groupCreate(groupParent);
        groupParent.groupsArr.push(currGroup);

        continue;
      } else if (closeBrackets.test(currChar)) {
        // level up
        isCloser = true;
      } else if (atomValid.test(currChar)) {
        const currChar = chem[i];
        const charsExtended = currChar + chem[i + 1];
        atom = currChar;

        if (atomValid.test(charsExtended)) {
          atom = charsExtended;
          i++;
        }
      }

      // chars for multiplier with slice and match method
      const multMatch = chem.slice(i + 1).match(multipliers);

      if (multMatch) {
        const multChem = multMatch[0];
        multiplier = +multChem;
        i += multChem.length;
      }

      if (isCloser) {
        currGroup.multiplier = multiplier;
        currGroup = currGroup.parent;
      } else {
        const currAtomCount = currGroup.atomsObj[atom] || 0;
        currGroup.atomsObj[atom] = currAtomCount + multiplier;
      }
    }

    return groupCollection;
  }

  // function for add atoms in group
  function addingGroup(group, multiplierCumulate = 1, acc = {}) {
    // destructuring for group variables
    const { groupsArr, atomsObj, multiplier } = group;

    multiplierCumulate *= multiplier;
    for (let i = 0; i < groupsArr.length; i++) {
      addingGroup(groupsArr[i], multiplierCumulate, acc);
    }

    // using forEach method for atomsObj
    Object.keys(atomsObj).forEach(atom => {
      const previousCount = acc[atom] || 0;
      const counting = atomsObj[atom];

      acc[atom] = previousCount + counting * multiplierCumulate;
    });

    return acc;
  }

  const groupCollection = groupsExtracting(formula);
  return addingGroup(groupCollection);
}





// display first example
const mol1 = molecularStructure("[C2H5]2NH");
for (let [key, value] of Object.entries(mol1)) {
  exampleOne.innerHTML += ` [${key}]:${value} 
    `;
}

// display second example
let mol2 = molecularStructure("Al2(SO4)3");
for (let [key, value] of Object.entries(mol2)) {
  exampleTwo.innerHTML += ` [${key}]:${value} 
  `;
}

// display third example
let mol3 = molecularStructure("Ge2{W5C5[MgH6(CO2)3]2}4Os5");
for (let [key, value] of Object.entries(mol3)) {
  exampleThree.innerHTML += ` [${key}]:${value} 
  `;
}


// enter your input formula
function displayStructure() {
  let form = yourFormula.value;
  document.getElementById("formulaDisplay").innerHTML = form;

  return form;
}

// display your formula
let yourFormula = molecularStructure("Ge2{W5C5[MgH6(CO2)3]2}4Os5");
for (let [key, value] of Object.entries(yourFormula)) {
  yourExample.innerHTML += ` [${key}]:${value} 
  `;
}
