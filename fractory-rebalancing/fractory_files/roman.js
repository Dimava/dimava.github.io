
log10 = Math.log(10);
log100 = Math.log(100);
log1000 = Math.log(1000);
NUMBER_SUFFIXES = ["K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "Nn",
                   "Dc", "UDc", "DDc", "TDc", "QaDc", "QtDc", "SxDc", "SpDc", "ODc", "NDc",
                   "Vi", "UVi", "DVi", "TVi", "QaVi", "QtVi", "SxVi", "SpVi", "OcVi", "NnVi",
                   "Tg", "UTg", "DTg", "TTg", "QaTg", "QtTg", "SxTg", "SpTg", "OcTg", "NnTg",
                   "Qd", "UQd", "DQd", "TQd", "QaQd", "QtQd", "SxQd", "SpQd", "OcQd", "NnQd",
                   "Qq", "UQq", "DQq", "TQq", "QaQq", "QtQq", "SxQq", "SpQq", "OcQq", "NnQq",
                   "Sg"
];
function format_number(num) {
    if(num < 1000) {
        return Math.floor(num);
    }
    var digits = Math.floor(Math.log(num) / log10 + 0.1);
    var suffix = NUMBER_SUFFIXES[Math.floor(digits / 3)-1];
    var smaller = (num / Math.pow(10, Math.floor(digits/3)*3));
    var fmted;
    if(smaller >= 100) fmted = smaller.toFixed(0);
    else if(smaller >= 10) fmted = smaller.toFixed(1);
    else fmted = smaller.toFixed(2);
    return fmted + suffix;


}


// Borrowed with gratitude from http://stackoverflow.com/a/9083857

Number.prototype.toRoman= function () {
    var num = Math.floor(this),
        val, s= '', i= 0,
        v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
        r = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

    function toBigRoman(n) {
        var ret = '', n1 = '', rem = n;
        while (rem > 1000) {
            var prefix = '', suffix = '', n = rem, s = '' + rem, magnitude = 1;
            while (n > 1000) {
                n /= 1000;
                magnitude *= 1000;
                prefix += '(';
                suffix += ')';
            }
            n1 = Math.floor(n);
            rem = s - (n1 * magnitude);
            ret += prefix + n1.toRoman() + suffix;
        }
        return ret + rem.toRoman();
    }

    if (this - num || num < 1) num = 0;
    if (num > 3999) return toBigRoman(num);

    while (num) {
        val = v[i];
        while (num >= val) {
            num -= val;
            s += r[i];
        }
        ++i;
    }
    return s;
};

Number.fromRoman = function (roman, accept) {
    var s = roman.toUpperCase().replace(/ +/g, ''),
        L = s.length, sum = 0, i = 0, next, val,
        R = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };

    function fromBigRoman(rn) {
        var n = 0, x, n1, S, rx =/(\(*)([MDCLXVI]+)/g;

        while ((S = rx.exec(rn)) != null) {
            x = S[1].length;
            n1 = Number.fromRoman(S[2])
            if (isNaN(n1)) return NaN;
            if (x) n1 *= Math.pow(1000, x);
            n += n1;
        }
        return n;
    }

    if (/^[MDCLXVI)(]+$/.test(s)) {
        if (s.indexOf('(') == 0) return fromBigRoman(s);

        while (i < L) {
            val = R[s.charAt(i++)];
            next = R[s.charAt(i)] || 0;
            if (next - val > 0) val *= -1;
            sum += val;
        }
        if (accept || sum.toRoman() === s) return sum;
    }
    return NaN;
};

Number.prototype.formatBig = function() {
    var num = this;

    var sign = 1;
    if(num < 0) {
        sign = -1;
        num *= -1;
    }
    if(num < 1 && num > 0) {
        return (sign * num).toFixed(2);
    }
    if(num < 1000) {
        return sign * Math.floor(num);
    }
    var digits = Math.floor(Math.log(num) / log10 + 0.1);
    var suffix = NUMBER_SUFFIXES[Math.floor(digits / 3)-1];
    if(!suffix) return num.toExponential(2);
    var smaller = (num / Math.pow(10, Math.floor(digits/3)*3));
    var fmted;
    if(smaller >= 100) fmted = (sign * smaller).toFixed(0);
    else if(smaller >= 10) fmted = (sign * smaller).toFixed(1);
    else fmted = (sign * smaller).toFixed(2);
    return fmted + suffix;
}

Number.prototype.formatByPercent = function() {
    var num = this;
    num -= 1;
    if(num < 0.1 && num % 0.01) {
        return (num * 100).toFixed(2) + '%';
    } else if(num <= 10) {
        return Math.floor(num * 100) + '%';
    } else {
        return (num + 1).formatBig() + 'x';
    }
}

Number.prototype.formatPercentOf = function() {
    var num = this;
    if(num < 0.1 && num % 0.01) {
        return (num * 100).toFixed(2) + '% of';
    } else if(num <= 2.5) {
        return Math.floor(num * 100) + '% of';
    } else {
        return num.formatBig() + 'x';
    }
}