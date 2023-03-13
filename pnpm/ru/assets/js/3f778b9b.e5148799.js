"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9672],{9613:(e,n,r)=>{r.d(n,{Zo:()=>u,kt:()=>f});var t=r(9496);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function l(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function p(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?l(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},l=Object.keys(e);for(t=0;t<l.length;t++)r=l[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)r=l[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var o=t.createContext({}),c=function(e){var n=t.useContext(o),r=n;return e&&(r="function"==typeof e?e(n):p(p({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(o.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,l=e.originalType,o=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),m=c(r),f=i,d=m["".concat(o,".").concat(f)]||m[f]||s[f]||l;return r?t.createElement(d,p(p({ref:n},u),{},{components:r})):t.createElement(d,p({ref:n},u))}));function f(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var l=r.length,p=new Array(l);p[0]=m;var a={};for(var o in n)hasOwnProperty.call(n,o)&&(a[o]=n[o]);a.originalType=e,a.mdxType="string"==typeof e?e:i,p[1]=a;for(var c=2;c<l;c++)p[c]=r[c];return t.createElement.apply(null,p)}return t.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5276:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>u,contentTitle:()=>o,default:()=>f,frontMatter:()=>a,metadata:()=>c,toc:()=>s});var t=r(2962),i=r(2742),l=(r(9496),r(9613)),p=["components"],a={id:"unlink",title:"pnpm unlink"},o=void 0,c={unversionedId:"cli/unlink",id:"version-6.x/cli/unlink",title:"pnpm unlink",description:"Unlinks a system-wide package (inverse of pnpm link).",source:"@site/i18n/ru/docusaurus-plugin-content-docs/version-6.x/cli/unlink.md",sourceDirName:"cli",slug:"/cli/unlink",permalink:"/pnpm/ru/6.x/cli/unlink",draft:!1,editUrl:"https://translate.pnpm.io/project/pnpm/ru",tags:[],version:"6.x",frontMatter:{id:"unlink",title:"pnpm unlink"},sidebar:"version-6.x/docs",previous:{title:"pnpm link",permalink:"/pnpm/ru/6.x/cli/link"},next:{title:"pnpm import",permalink:"/pnpm/ru/6.x/cli/import"}},u={},s=[{value:"\u041e\u043f\u0446\u0438\u0438",id:"\u043e\u043f\u0446\u0438\u0438",level:2},{value:"--recursive, -r",id:"--recursive--r",level:3},{value:"--filter &lt;\u0441\u0435\u043b\u0435\u043a\u0442\u043e\u0440 \u043f\u0430\u043a\u0435\u0442\u0430&gt;",id:"--filter-\u0441\u0435\u043b\u0435\u043a\u0442\u043e\u0440-\u043f\u0430\u043a\u0435\u0442\u0430",level:3}],m={toc:s};function f(e){var n=e.components,r=(0,i.Z)(e,p);return(0,l.kt)("wrapper",(0,t.Z)({},m,r,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Unlinks a system-wide package (inverse of ",(0,l.kt)("a",{parentName:"p",href:"/pnpm/ru/6.x/cli/link"},(0,l.kt)("inlineCode",{parentName:"a"},"pnpm link")),")."),(0,l.kt)("p",null,"If called without arguments, all linked dependencies will be unlinked."),(0,l.kt)("p",null,"This is similar to ",(0,l.kt)("inlineCode",{parentName:"p"},"yarn unlink"),", except pnpm re-installs the dependency after removing the external link."),(0,l.kt)("h2",{id:"\u043e\u043f\u0446\u0438\u0438"},"\u041e\u043f\u0446\u0438\u0438"),(0,l.kt)("h3",{id:"--recursive--r"},"--recursive, -r"),(0,l.kt)("p",null,"Unlink in every package found in subdirectories or in every workspace package, when executed inside a ",(0,l.kt)("a",{parentName:"p",href:"/pnpm/ru/6.x/workspaces"},"workspace"),"."),(0,l.kt)("h3",{id:"--filter-\u0441\u0435\u043b\u0435\u043a\u0442\u043e\u0440-\u043f\u0430\u043a\u0435\u0442\u0430"},"--filter ","<","\u0441\u0435\u043b\u0435\u043a\u0442\u043e\u0440 \u043f\u0430\u043a\u0435\u0442\u0430",">"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/pnpm/ru/6.x/filtering"},"\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435 \u043e \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u0446\u0438\u0438.")))}f.isMDXComponent=!0}}]);