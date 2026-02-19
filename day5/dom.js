/* =========================
   1. User Initials
=========================*/
const getUserInitials = ({ firstName = "", lastName = "" }) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();


/* =========================
   2. Count Properties
=========================*/
const countProperties = (obj) =>
  Reflect.ownKeys(obj).length;


/* =========================
   3. Invert Object
=========================*/
function invertObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});
}


/* =========================
   4. Remove Falsy Values
=========================*/
const removeFalsyValues = (arr) =>
  arr.filter(Boolean);


/* =========================
   5. Group By Age
=========================*/
function groupByAge(people) {
  return people.reduce((group, person) => {
    (group[person.age] ??= []).push(person);
    return group;
  }, {});
}


/* =========================
   6. Most Frequent Element
=========================*/
function findMostFrequentElement(arr) {
  const freq = new Map();
  let maxCount = 0;
  let result = null;

  for (const value of arr) {
    const count = (freq.get(value) || 0) + 1;
    freq.set(value, count);

    if (count > maxCount) {
      maxCount = count;
      result = value;
    }
  }
  return result;
}


/* =========================
   7. Flatten Array
=========================*/
const flatten = (arr) => arr.flat(Infinity);


/* =========================
   8. Deep Merge Objects
=========================*/
function mergeObjects(...objs) {
  return objs.reduce((acc, obj) => {

    Object.entries(obj).forEach(([key, value]) => {
      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        acc[key] = mergeObjects(acc[key] || {}, value);
      } else {
        acc[key] = value;
      }
    });

    return acc;
  }, {});
}


/* =========================
   9. Rotate Array
=========================*/
function rotateArray(arr, k) {
  if (!arr.length) return arr;
  const shift = ((k % arr.length) + arr.length) % arr.length;
  return [...arr.slice(-shift), ...arr.slice(0, -shift)];
}


/* =========================
   10. Array Intersection
=========================*/
function intersection(a, b) {
  const setB = new Set(b);
  return [...new Set(a.filter(x => setB.has(x)))];
}


/* =========================
   11. Group Anagrams
=========================*/
function groupAnagrams(words) {
  const groups = new Map();

  for (const word of words) {
    const key = [...word].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }

  return [...groups.values()];
}


/* =========================
   12. Move Zeros To End
=========================*/
function moveZerosToEnd(arr) {
  const nonZero = arr.filter(n => n !== 0);
  return [
    ...nonZero,
    ...Array(arr.length - nonZero.length).fill(0)
  ];
}


/* =========================
   13. Longest Consecutive Sequence
=========================*/
function longestConsecutiveSequence(nums) {
  const set = new Set(nums);
  let longest = 0;

  for (const num of set) {
    if (!set.has(num - 1)) {
      let streak = 1;
      let current = num;

      while (set.has(current + 1)) {
        current++;
        streak++;
      }

      longest = Math.max(longest, streak);
    }
  }
  return longest;
}


/* =========================
   14. Product Except Self
=========================*/
function productExceptSelf(nums) {
  const result = Array(nums.length).fill(1);

  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}


/* =========================
   15. Deep Equal
=========================*/
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    !a || !b
  ) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key =>
    deepEqual(a[key], b[key])
  );
}


/* =========================
   16. Custom Serializer
=========================*/
function serializeObject(obj) {
  return JSON.stringify(obj, (_, value) => {

    if (value instanceof Date)
      return { type: "Date", value: value.toISOString() };

    if (value instanceof Map)
      return { type: "Map", value: [...value.entries()] };

    if (value instanceof Set)
      return { type: "Set", value: [...value] };

    if (value === undefined)
      return { type: "Undefined" };

    return value;
  });
}

function deserializeObject(str) {
  return JSON.parse(str, (_, value) => {

    if (!value?.type) return value;

    switch (value.type) {
      case "Date": return new Date(value.value);
      case "Map": return new Map(value.value);
      case "Set": return new Set(value.value);
      case "Undefined": return undefined;
      default: return value;
    }
  });
}
