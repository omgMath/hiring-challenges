// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// Modified for typescript / lint conformity

type TDefaultSet = Set<any>;
type TDefaultIterable = Iterable<any>;

export const isSuperset = (set: TDefaultSet, subset: TDefaultIterable) => {
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
};

export const union = (setA: TDefaultIterable, setB: TDefaultIterable) => {
    const _union = new Set(setA);
    for (const elem of setB) {
        _union.add(elem);
    }
    return _union;
};

export const intersection = (setA: TDefaultSet, setB: TDefaultIterable) => {
    const _intersection = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
};

export const symmetricDifference = (setA: TDefaultIterable, setB: TDefaultIterable) => {
    const _difference = new Set(setA);
    for (const elem of setB) {
        if (_difference.has(elem)) {
            _difference.delete(elem);
        } else {
            _difference.add(elem);
        }
    }
    return _difference;
};

export const difference = (setA: TDefaultIterable, setB: TDefaultIterable) => {
    const _difference = new Set(setA);
    for (const elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
};