Mx = class Matrix extends Array {
    constructor(A, B) {
        super();
        if (!A)
            return this;
        if (Array.isArray(A)) {
            if (Array.isArray(A[0])) {
                for (let a of A)
                    this.push(a.slice());
            } else {
                for (let a of A)
                    this.push([a]);
            }
        }
        if (typeof A == 'number' && typeof B == 'undefined') {
            B = A;
        }
        if (typeof A == 'number' && typeof B == 'number') {
            while (this.length < A)
                this.push(Array(B).fill(0));
        }
    }
    static from(A, copy=false) {
        if (copy)
            return new Matrix(A);
        if (A instanceof Matrix)
            return A;
        return new Matrix(A);
    }
    transposed() {
        let m = new Matrix();
        for (let i = 0; i < this.length; i++) {
            m.push(Array.from(this, e=>e[i]));
        }
        return m;
    }

    mul_ar(x) {
        return Array.from(this, r=>Matrix.mul_ar_ar(r, x));
        return this.map(r=>r.map((e,i)=>e * x[i]));
    }
    static mul_ar_ar(a, b) {
        if (a.length != b.length) throw new Error('arrays have different sizes');
        let s = 0;
        for (let i = 0; i < a.length; i++) {
            s += a[i] * b[i];
        }
        return s;
    }

    mul_mx(B) {
        if (B.length != this[0].length)
            throw new Error('matrices have different sizes!');
        let Bt = Matrix.from(B).transpose();
        return this.map(r=>Array.from(Bt, br=>Matrix.mul_ar_ar(r, Bt)));
    }

    // static LU_U(A) {
    //     A = A.map(e=>e.slice());

    //     for (let y = 1; y < A.length; y++) {
    //         let r = A[y];
    //         for (let y2 = y + 1; y2 < A.length; y2++) {
    //             let r2 = A[y2];
    //             let k = r2[y] / r[y];
    //             for (let x = 1; x < r2.length; x++) {
    //                 r2[x] -= r[x] * k;
    //             }
    //         }
    //     }

    //     return A;
    // }

    // static LU_L(A) {
    //     A = A.map(e=>e.slice());
    //     let L = A.map(e=>[, ]);

    //     for (let y = 1; y < A.length; y++) {
    //         let r = A[y];
    //         for (let y2 = y + 1; y2 < A.length; y2++) {
    //             let r2 = A[y2];
    //             let k = r2[y] / r[y];
    //             L[y2].push(k);
    //             for (let x = 1; x < r2.length; x++) {
    //                 r2[x] -= r[x] * k;
    //             }
    //         }
    //     }
    //     for (let y = 1; y < L.length; y++) {
    //         let r = L[y];
    //         r.push(1);
    //         while (r.length < L.length)
    //             r.push(0);
    //     }

    //     return L;
    // }

    // static solve_L(L, d) {
    //     let x = d.map(e=>0);
    //     for (let y = 1; y < L.length; y++) {
    //         x[y] = (d[y] - this.mul_ar_ar(L[y], x)) / L[y][y];
    //     }
    //     return x;
    // }
    // static solve_U(U, d) {
    //     let x = d.map(e=>0);
    //     for (let y = U.length - 1; y > 0; y--) {
    //         x[y] = (d[y] - this.mul_ar_ar(U[y], x)) / U[y][y];
    //     }
    //     return x;
    // }

    // static mx_ar(x, r=true) {
    //     return r ? x.map(e=>[, e]) : [, ...x];
    // }

    // static cholesky(A) {
    //     A = A.map(e=>e.slice());

    //     for (let y = 1; y < A.length; y++) {
    //         let r = A[y];
    //         let k = Math.sqrt(r[y]);
    //         for (let x = 1; x < r.length; x++)
    //             r[x] /= k;
    //         for (let y2 = y + 1; y2 < A.length; y2++) {
    //             let r2 = A[y2];
    //             let k = r2[y] / r[y];
    //             for (let x = 1; x < r2.length; x++) {
    //                 r2[x] -= r[x] * k;
    //             }
    //         }
    //     }
    //     return this.t(A);
    // }

    // static t(A) {
    //     let T = [, ];
    //     for (let x = 1; x < A[1].length; x++)
    //         T.push(A.map(r=>r[x]));
    //     return T;
    // }

    // static parse(s, as_txt=false) {
    //     s = s.replace(/\s*,\s*/g, '.').replace(/[−]/g, '-').replace(/((?!\n)\s)*([-.\d]+)/g, ', $2');
    //     //         
    //     if (!s.match(/\n/)) {
    //         s = s.replace(/.*?,/, '[') + ']';
    //     } else if (s.match(/\d+[^\d\n]+\d+/)) {
    //         s = s.replace(/^|\n/g, '],//\n[').replace(/.*/, '[,//') + ']]\n';
    //     } else {
    //         s = s.replace(/.*\n/, '[').replace(/\n/g, '') + ']';
    //     }
    //     return as_txt ? s : eval(s);
    // }

    // static toString(A) {
    //     return A && A.slice(1).map(e=>e.slice(1).join('\t')).join('\n');
    // }

    // static run_gauss_mx_ar(A, D) {
    //     //     let _, ɣ = 0, 
    //     let alpha = 0
    //       , beta = 0
    //       , gamma = 0;
    //     let prev = {
    //         alpha,
    //         beta,
    //         gamma
    //     }
    //       , p0 = prev;
    //     let R = [, ];
    //     for (let y = 1; y < A.length; y++) {
    //         let r = A[y];
    //         let a = r[y - 1] || 0
    //           , b = r[y]
    //           , c = r[y + 1] || 0
    //           , d = D[y];

    //         gamma = b + a * prev.alpha;
    //         alpha = -c / gamma;
    //         beta = (d - a * beta) / gamma;
    //         prev = {
    //             alpha,
    //             beta,
    //             gamma
    //         };
    //         R.push(prev);
    //     }
    //     R.push({
    //         x: 0
    //     });
    //     for (let y = A.length - 1; y > 0; y--) {
    //         let r = R[y];
    //         r.x = r.alpha * R[y + 1].x + r.beta;
    //     }
    //     return R;
    // }

    // static norm_1_ar(x) {
    //     return x.slice(1).reduce((v,e)=>v + Math.abs(e), 0);
    // }

    // static norm_2_ar(x) {
    //     return Math.sqrt(x.slice(1).reduce((v,e)=>v + e ** 2, 0));
    // }

    // static norm_inf_ar(x) {
    //     return Math.max(...x.slice(1).map(Math.abs));
    // }

    // static norm_e_mx(A) {
    //     let s = 0;
    //     for (let y = 1; y < A.length; y++) {
    //         let r = A[y];
    //         for (let x = 1; x < r.length; x++)
    //             s += r[x] ** 2;
    //     }
    //     return Math.sqrt(s);
    // }
    // static norm_inf_mx(A) {
    //     return this.norm_inf_ar(A.map(this.norm_1_ar))
    // }
    // static norm_1_mx(A) {
    //     return this.norm_inf_mx(this.t(A));
    // }
    // static swapRows(A, y1, y2) {
    //     [A[y1],A[y2]] = [A[y2], A[y1]];
    // }

    self_add(from, to, mul, _start=0) {
        from = this[from];
        to = this[to];
        for (let i = _start; i < from.length; i++) {
            to[i] += mul * from[i];
        }
    }
    self_mul(from, mul, _start=0) {
        from = this[from];
        for (let i = _start; i < from.length; i++) {
            from[i] *= mul;
        }
    }

    self_swap(from, to) {
        [this[from],this[to]] = [this[to], this[from]];
    }

    push_col(x) {
        if (this.length != x.length)
            throw new Error('different sizes');

        for (let i = 0; i < x.length; i++) {
            this[i].push(x[i]);
        }
    }
    pop_col() {
        return Array.from(this, r=>r.pop());
    }
    nth_col(n) {
        n = n % this[0].length;
        if (n < 0)
            n += this[0].length;
        return Array.from(this, r=>r[n]);
    }

    gauss_step_down(i, h=i) {
        if (i >= this.length || h >= this[0].length - 1) return h;
        if (!this[i][h]) {
            // swap to get non-zero
            let i2 = i;
            while (i2 < this.length && !this[i2][h])
                i2++;
            if (i2 >= this.length) {
                // this WILL break multisolutions!
                if (this[i].reduce((v,e)=>v || e) == 0) {
                    this[i][h] = 1;
                } else {
                    return 999; /// truly unsolvable?                
                }
            } else {
                this.self_swap(i, i2);
            }
        }

        for (let i2 = i + 1; i2 < this.length; i2++) {
            this.self_add(i, i2, -this[i2][h] / this[i][h]);
        }
        this.self_mul(i, 1 / this[i][h], h);
        return h + 1;
    }

    gauss_try_solve() {
        let h = 0, i = 0
        for (i; i < this.length && h < this[0].length - 1; i++) {
            h = this.gauss_step_down(i, h);
            console.log({i,h});
        }
            console.table(this);
        h = h;

        // if it can be solved, all numbers bolow last 1 will be 0s
        for (i; i < this.length; i++) {
            if (this[i][this[0].length-1]) {
                return false;
            }
        }
        return true;

    }

    gauss_step_up(i, h=i) {
        if (!this[i][h]) return;
        for (let i2 = i - 1; i2 >= 0; i2--) {
            this.self_add(i, i2, -this[i2][h] / this[i][h]);
        }
    }

    rounded(n=4) {
        let k = 10 ** n;
        function round(e) {
            return Math.round(e * k) / k;
        }
        return this.map(r=>r.map(round));
    }

    // static zeidelN(A, b, n, zero, silent) {
    //     let B1 = mx._.B1 = A.map((r,i)=>r.map((e,j)=>i <= j ? 0 : -e / r[i]));
    //     let B2 = mx._.B2 = A.map((r,i)=>r.map((e,j)=>i >= j ? 0 : -e / r[i]));
    //     let c = mx._.c = b.map((e,i)=>e / A[i][i]);
    //     silent || console.log('zeidel: B1: %o, B2: %o, c: %o', mx.round(B1, 4), mx.round(B2, 4), mx.round(c, 4))
    //     let x = c.slice().map(e=>zero ? 0 : e);
    //     let y = c.slice().map(e=>zero ? 0 : e);
    //     while (n-- > 0) {
    //         for (let i = 1; i < y.length; i++) {
    //             y[i] = mx.mul_ar_ar(B1[i], y) + mx.mul_ar_ar(B2[i], x) + c[i];
    //         }
    //         x = y;
    //     }
    //     return x;
    // }

    // static jacobiN(A, b, n) {
    //     let B = mx._.B = A.map((r,i)=>r.map((e,j)=>i == j ? 0 : -e / r[i]));
    //     let c = mx._.c = b.map((e,i)=>e / A[i][i]);
    //     console.log('jacobi: B: %o, c: %o', mx.round(B, 4), mx.round(c, 4))
    //     let x = c.slice();
    //     while (n-- > 0)
    //         x = mx.mul_mx_ar(B, x).map((e,i)=>e + c[i]);
    //     return x;
    // }
}
Mx._ = {};

m = new Mx([[1, 2], [3, 4]])
