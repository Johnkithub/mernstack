/* ===============================
   Beginner 1 – User Initials
================================*/
const getUserInitials = ({ firstName = "", lastName = "" }) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();


/* ===============================
   Beginner 2 – Count Properties
================================*/
const countProperties = obj =>
  Reflect.ownKeys(obj).length;


/* ===============================
   Beginner 3 – Invert Object
================================*/
function invertObject(obj) {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[v] = k;
    return acc;
  }, {});
}


/* ===============================
   Beginner 4 – Remove Falsy
================================*/
const removeFalsyValues = arr => arr.filter(Boolean);


/* ===============================
   Easy 5 – Group By Age
================================*/
function groupByAge(people) {
  return people.reduce((acc, person) => {
    (acc[person.age] ??= []).push(person);
    return acc;
  }, {});
}


/* ===============================
   Easy 6 – Most Frequent Element
================================*/
function findMostFrequentElement(arr) {
  const freq = new Map();
  let max = 0;
  let result = null;

  for (const val of arr) {
    const count = (freq.get(val) || 0) + 1;
    freq.set(val, count);

    if (count > max) {
      max = count;
      result = val;
    }
  }
  return result;
}


/* ===============================
   Easy 7 – Flatten Array
================================*/
function flatten(arr) {
  return arr.flat(Infinity);
}


/* ===============================
   Medium 8 – Deep Merge
================================*/
function mergeObjects(...objects) {
  return objects.reduce((acc, obj) => {

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


/* ===============================
   Medium 9 – Rotate Array
================================*/
function rotateArray(arr, k) {
  if (!arr.length) return arr;

  const shift = ((k % arr.length) + arr.length) % arr.length;
  return [...arr.slice(-shift), ...arr.slice(0, -shift)];
}


/* ===============================
   Medium 10 – Intersection
================================*/
function intersection(nums1, nums2) {
  const set1 = new Set(nums1);
  return [...new Set(nums2.filter(n => set1.has(n)))];
}


/* ===============================
   Medium 11 – Group Anagrams
================================*/
function groupAnagrams(words) {
  const map = new Map();

  for (const word of words) {
    const key = [...word].sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }

  return [...map.values()];
}


/* ===============================
   Medium-Hard 12 – Move Zeros
================================*/
function moveZerosToEnd(arr) {
  const nonZero = arr.filter(n => n !== 0);
  return [
    ...nonZero,
    ...Array(arr.length - nonZero.length).fill(0)
  ];
}


/* ===============================
   Hard 13 – Longest Consecutive
================================*/
function longestConsecutiveSequence(nums) {
  const set = new Set(nums);
  let longest = 0;

  for (const num of set) {
    if (!set.has(num - 1)) {

      let current = num;
      let streak = 1;

      while (set.has(current + 1)) {
        current++;
        streak++;
      }

      longest = Math.max(longest, streak);
    }
  }
  return longest;
}


/* ===============================
   Hard 14 – Product Except Self
================================*/
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


/* ===============================
   Hard 15 – Deep Equal
================================*/
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


/* ===============================
   Hard 16 – Serializer
================================*/
function serializeObject(obj) {
  return JSON.stringify(obj, (_, value) => {

    if (value === undefined)
      return { type: "Undefined" };

    if (value instanceof Date)
      return { type: "Date", value: value.toISOString() };

    if (value instanceof Map)
      return { type: "Map", value: [...value.entries()] };

    if (value instanceof Set)
      return { type: "Set", value: [...value] };

    return value;
  });
}

function deserializeObject(str) {
  return JSON.parse(str, (_, value) => {

    if (!value?.type) return value;

    switch (value.type) {
      case "Undefined": return undefined;
      case "Date": return new Date(value.value);
      case "Map": return new Map(value.value);
      case "Set": return new Set(value.value);
      default: return value;
    }

  });
}
