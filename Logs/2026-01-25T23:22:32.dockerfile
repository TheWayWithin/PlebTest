2026-01-25T23:22:32.993320638Z [inf]  
2026-01-25T23:22:34.401141607Z [inf]  [35m[Region: us-east4][0m
2026-01-25T23:22:34.407540999Z [inf]  [35m==============
2026-01-25T23:22:34.407573434Z [inf]  Using Nixpacks
2026-01-25T23:22:34.407577608Z [inf]  ==============
2026-01-25T23:22:34.407581030Z [inf]  [0m
2026-01-25T23:22:34.407654685Z [inf]  context: hvx7-vNrX
2026-01-25T23:22:34.527851551Z [inf]  ╔════════ Nixpacks v1.38.0 ═══════╗
2026-01-25T23:22:34.527895655Z [inf]  ║ setup      │ nodejs_20, npm-9_x ║
2026-01-25T23:22:34.527900677Z [inf]  ║─────────────────────────────────║
2026-01-25T23:22:34.527904474Z [inf]  ║ install    │ npm ci             ║
2026-01-25T23:22:34.527910495Z [inf]  ║─────────────────────────────────║
2026-01-25T23:22:34.527913861Z [inf]  ║ build      │ npm run build      ║
2026-01-25T23:22:34.527917289Z [inf]  ║─────────────────────────────────║
2026-01-25T23:22:34.527920519Z [inf]  ║ start      │ npm run start      ║
2026-01-25T23:22:34.527924211Z [inf]  ╚═════════════════════════════════╝
2026-01-25T23:22:34.750305164Z [inf]  [internal] load build definition from Dockerfile
2026-01-25T23:22:34.750365595Z [inf]  [internal] load build definition from Dockerfile
2026-01-25T23:22:34.750388998Z [inf]  [internal] load build definition from Dockerfile
2026-01-25T23:22:34.750407998Z [inf]  [internal] load build definition from Dockerfile
2026-01-25T23:22:34.761508944Z [inf]  [internal] load build definition from Dockerfile
2026-01-25T23:22:34.763623250Z [inf]  [internal] load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1745885067
2026-01-25T23:22:34.839962270Z [inf]  [internal] load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1745885067
2026-01-25T23:22:34.840371082Z [inf]  [internal] load .dockerignore
2026-01-25T23:22:34.840429739Z [inf]  [internal] load .dockerignore
2026-01-25T23:22:34.840449235Z [inf]  [internal] load .dockerignore
2026-01-25T23:22:34.840646676Z [inf]  [internal] load .dockerignore
2026-01-25T23:22:34.849132619Z [inf]  [internal] load .dockerignore
2026-01-25T23:22:34.855684969Z [inf]  [stage-0 10/10] COPY . /app
2026-01-25T23:22:34.855704398Z [inf]  [stage-0  9/10] RUN printf '\nPATH=/app/node_modules/.bin:$PATH' >> /root/.profile
2026-01-25T23:22:34.855714488Z [inf]  [stage-0  8/10] RUN --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-next/cache,target=/app/.next/cache --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-01-25T23:22:34.855726586Z [inf]  [stage-0  7/10] COPY . /app/.
2026-01-25T23:22:34.855732469Z [inf]  [stage-0  6/10] RUN --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-/root/npm,target=/root/.npm npm ci
2026-01-25T23:22:34.855738161Z [inf]  [stage-0  5/10] COPY . /app/.
2026-01-25T23:22:34.855744062Z [inf]  [stage-0  4/10] RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d
2026-01-25T23:22:34.855752347Z [inf]  [stage-0  3/10] COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
2026-01-25T23:22:34.855758166Z [inf]  [internal] load build context
2026-01-25T23:22:34.855763663Z [inf]  [stage-0  2/10] WORKDIR /app/
2026-01-25T23:22:34.855769941Z [inf]  [stage-0  1/10] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-01-25T23:22:34.855781992Z [inf]  [stage-0  1/10] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-01-25T23:22:34.855791318Z [inf]  [internal] load build context
2026-01-25T23:22:34.856242846Z [inf]  [internal] load build context
2026-01-25T23:22:34.862526774Z [inf]  [stage-0  1/10] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-01-25T23:22:34.918020208Z [inf]  [internal] load build context
2026-01-25T23:22:34.919880534Z [inf]  [stage-0  2/10] WORKDIR /app/
2026-01-25T23:22:34.919943565Z [inf]  [stage-0  3/10] COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
2026-01-25T23:22:39.191726600Z [inf]  [stage-0  3/10] COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix
2026-01-25T23:22:39.194071206Z [inf]  [stage-0  4/10] RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d
2026-01-25T23:22:39.381084926Z [inf]  unpacking 'https://github.com/NixOS/nixpkgs/archive/ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.tar.gz' into the Git cache...

2026-01-25T23:23:07.350170382Z [inf]  unpacking 'https://github.com/railwayapp/nix-npm-overlay/archive/main.tar.gz' into the Git cache...

2026-01-25T23:23:07.811391879Z [inf]  installing 'ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env'

2026-01-25T23:23:08.592835694Z [inf]  these 5 derivations will be built:
  /nix/store/1f4a312hz9m6y1ssip52drgkim8az4d6-libraries.drv
  /nix/store/6vy68gykpxfphbmmyd59ya88xvrwvvaa-npm-9.9.4.tgz.drv
  /nix/store/79g4v87v1cgrx5vlwzcagcs6v8ps8fk2-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env.drv
  /nix/store/w9h0z1lhfwxc0m38f3w5brfdqrzm4wyj-npm.drv
  /nix/store/j35hwrlsfar9sl236alrb60mcvhxqyp7-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env.drv

2026-01-25T23:23:08.592857906Z [inf]  these 75 paths will be fetched (117.76 MiB download, 559.92 MiB unpacked):
  /nix/store/cf7gkacyxmm66lwl5nj6j6yykbrg4q5c-acl-2.3.2
  /nix/store/a9jgnlhkjkxav6qrc3rzg2q84pkl2wvr-attr-2.5.2
  /nix/store/5mh7kaj2fyv8mk4sfq1brwxgc02884wi-bash-5.2p37
  /nix/store/j7p46r8v9gcpbxx89pbqlh61zhd33gzv-binutils-2.43.1
  /nix/store/df2a8k58k00f2dh2x930dg6xs6g6mliv-binutils-2.43.1-lib
  /nix/store/srcmmqi8kxjfygd0hyy42c8hv6cws83b-binutils-wrapper-2.43.1
  /nix/store/wf5zj2gbib3gjqllkabxaw4dh0gzcla3-builder.pl
  /nix/store/ivl2v8rgg7qh1jkj5pwpqycax3rc2hnl-bzip2-1.0.8
  /nix/store/mglixp03lsp0w986svwdvm7vcy17rdax-bzip2-1.0.8-bin
  /nix/store/4s9rah4cwaxflicsk5cndnknqlk9n4p3-coreutils-9.5
  /nix/store/pkc7mb4a4qvyz73srkqh4mwl70w98dsv-curl-8.11.0

2026-01-25T23:23:08.592864656Z [inf]    /nix/store/p123cq20klajcl9hj8jnkjip5nw6awhz-curl-8.11.0-bin
  /nix/store/5f5linrxzhhb3mrclkwdpm9bd8ygldna-curl-8.11.0-dev
  /nix/store/agvks3qmzja0yj54szi3vja6vx3cwkkw-curl-8.11.0-man
  /nix/store/00g69vw7c9lycy63h45ximy0wmzqx5y6-diffutils-3.10
  /nix/store/74h4z8k82pmp24xryflv4lxkz8jlpqqd-ed-1.20.2
  /nix/store/qbry6090vlr9ar33kdmmbq2p5apzbga8-expand-response-params

2026-01-25T23:23:08.592867706Z [inf]    /nix/store/c4rj90r2m89rxs64hmm857mipwjhig5d-file-5.46
  /nix/store/jqrz1vq5nz4lnv9pqzydj0ir58wbjfy1-findutils-4.10.0
  /nix/store/a3c47r5z1q2c4rz0kvq8hlilkhx2s718-gawk-5.3.1
  /nix/store/l89iqc7am6i60y8vk507zwrzxf0wcd3v-gcc-14-20241116

2026-01-25T23:23:08.592870994Z [inf]    /nix/store/bpq1s72cw9qb2fs8mnmlw6hn2c7iy0ss-gcc-14-20241116-lib
  /nix/store/17v0ywnr3akp85pvdi56gwl99ljv95kx-gcc-14-20241116-libgcc

2026-01-25T23:23:08.592874945Z [inf]    /nix/store/xcn9p4xxfbvlkpah7pwchpav4ab9d135-gcc-wrapper-14-20241116
  /nix/store/65h17wjrrlsj2rj540igylrx7fqcd6vq-glibc-2.40-36
  /nix/store/1c6bmxrrhm8bd26ai2rjqld2yyjrxhds-glibc-2.40-36-bin

2026-01-25T23:23:08.592878401Z [inf]    /nix/store/kj8hbqx4ds9qm9mq7hyikxyfwwg13kzj-glibc-2.40-36-dev
  /nix/store/kryrg7ds05iwcmy81amavk8w13y4lxbs-gmp-6.3.0

2026-01-25T23:23:08.592880977Z [inf]    /nix/store/a2byxfv4lc8f2g5xfzw8cz5q8k05wi29-gmp-with-cxx-6.3.0
  /nix/store/1m67ipsk39xvhyqrxnzv2m2p48pil8kl-gnu-config-2024-01-01

2026-01-25T23:23:08.592886184Z [inf]    /nix/store/aap6cq56amx4mzbyxp2wpgsf1kqjcr1f-gnugrep-3.11
  /nix/store/fp6cjl1zcmm6mawsnrb5yak1wkz2ma8l-gnumake-4.4.1

2026-01-25T23:23:08.592891368Z [inf]    /nix/store/abm77lnrkrkb58z6xp1qwjcr1xgkcfwm-gnused-4.9
  /nix/store/9cwwj1c9csmc85l2cqzs3h9hbf1vwl6c-gnutar-1.35
  /nix/store/nvvj6sk0k6px48436drlblf4gafgbvzr-gzip-1.13
  /nix/store/wwipgdqb4p2fr46kmw9c5wlk799kbl68-icu4c-74.2
  /nix/store/m8w3mf0i4862q22bxad0wspkgdy4jnkk-icu4c-74.2-dev

2026-01-25T23:23:08.592893822Z [inf]    /nix/store/xmbv8s4p4i4dbxgkgdrdfb0ym25wh6gk-isl-0.20
  /nix/store/2wh1gqyzf5xsvxpdz2k0bxiz583wwq29-keyutils-1.6.3-lib

2026-01-25T23:23:08.592895783Z [inf]    /nix/store/milph81dilrh96isyivh5n50agpx39k2-krb5-1.21.3

2026-01-25T23:23:08.592897998Z [inf]    /nix/store/b56mswksrql15knpb1bnhv3ysif340kd-krb5-1.21.3-dev

2026-01-25T23:23:08.592900632Z [inf]    /nix/store/v9c1s50x7magpiqgycxxkn36avzbcg0g-krb5-1.21.3-lib
  /nix/store/34z2792zyd4ayl5186vx0s98ckdaccz9-libidn2-2.3.7

2026-01-25T23:23:08.592903281Z [inf]    /nix/store/2a3anh8vl3fcgk0fvaravlimrqawawza-libmpc-1.3.1
  /nix/store/8675pnfr4fqnwv4pzjl67hdwls4q13aa-libssh2-1.11.1

2026-01-25T23:23:08.592909138Z [inf]    /nix/store/d7zhcrcc7q3yfbm3qkqpgc3daq82spwi-libssh2-1.11.1-dev

2026-01-25T23:23:08.592912036Z [inf]    /nix/store/xcqcgqazykf6s7fsn08k0blnh0wisdcl-libunistring-1.3
  /nix/store/r9ac2hwnmb0nxwsrvr6gi9wsqf2whfqj-libuv-1.49.2
  /nix/store/ll14czvpxglf6nnwmmrmygplm830fvlv-libuv-1.49.2-dev
  /nix/store/6cr0spsvymmrp1hj5n0kbaxw55w1lqyp-libxcrypt-4.4.36

2026-01-25T23:23:08.59291396Z [inf]    /nix/store/pc74azbkr19rkd5bjalq2xwx86cj3cga-linux-headers-6.12
  /nix/store/fv7gpnvg922frkh81w5hkdhpz0nw3iiz-mirrors-list

2026-01-25T23:23:08.592915735Z [inf]    /nix/store/qs22aazzrdd4dnjf9vffl0n31hvls43h-mpfr-4.2.1

2026-01-25T23:23:08.592918584Z [inf]    /nix/store/grixvx878884hy8x3xs0c0s1i00j632k-nghttp2-1.64.0

2026-01-25T23:23:08.592920918Z [inf]    /nix/store/dz97fw51rm5bl9kz1vg0haj1j1a7r1mr-nghttp2-1.64.0-dev
  /nix/store/qcghigzrz56vczwlzg9c02vbs6zr9jkz-nghttp2-1.64.0-lib

2026-01-25T23:23:08.592923045Z [inf]    /nix/store/j7dx1n6m5axf9r2bvly580x2ixx546wq-nodejs-20.18.1

2026-01-25T23:23:08.59292559Z [inf]    /nix/store/9l9n7a0v4aibcz0sgd0crs209an9p7dz-openssl-3.3.2
  /nix/store/h1ydpxkw9qhjdxjpic1pdc2nirggyy6f-openssl-3.3.2

2026-01-25T23:23:08.592927938Z [inf]    /nix/store/lygl27c44xv73kx1spskcgvzwq7z337c-openssl-3.3.2-bin

2026-01-25T23:23:08.592930761Z [inf]    /nix/store/qq5q0alyzywdazhmybi7m69akz0ppk05-openssl-3.3.2-bin
  /nix/store/kqm7wpqkzc4bwjlzqizcbz0mgkj06a9x-openssl-3.3.2-dev

2026-01-25T23:23:08.592933555Z [inf]    /nix/store/pp2zf8bdgyz60ds8vcshk2603gcjgp72-openssl-3.3.2-dev
  /nix/store/5yja5dpk2qw1v5mbfbl2d7klcdfrh90w-patch-2.7.6

2026-01-25T23:23:08.592935784Z [inf]    /nix/store/srfxqk119fijwnprgsqvn68ys9kiw0bn-patchelf-0.15.0
  /nix/store/3j1p598fivxs69wx3a657ysv3rw8k06l-pcre2-10.44

2026-01-25T23:23:08.592937825Z [inf]    /nix/store/1i003ijlh9i0mzp6alqby5hg3090pjdx-perl-5.40.0

2026-01-25T23:23:08.592939874Z [inf]    /nix/store/4ig84cyqi6qy4n0sanrbzsw1ixa497jx-stdenv-linux

2026-01-25T23:23:08.59294632Z [inf]    /nix/store/d0gfdcag8bxzvg7ww4s7px4lf8sxisyx-stdenv-linux
  /nix/store/d29r1bdmlvwmj52apgcdxfl1mm9c5782-update-autotools-gnu-config-scripts-hook

2026-01-25T23:23:08.592952481Z [inf]    /nix/store/acfkqzj5qrqs88a4a6ixnybbjxja663d-xgcc-14-20241116-libgcc
  /nix/store/c2njy6bv84kw1i4bjf5k5gn7gz8hn57n-xz-5.6.3
  /nix/store/h18s640fnhhj2qdh5vivcfbxvz377srg-xz-5.6.3-bin

2026-01-25T23:23:08.592996521Z [inf]    /nix/store/cqlaa2xf6lslnizyj9xqa8j0ii1yqw0x-zlib-1.3.1
  /nix/store/1lggwqzapn5mn49l9zy4h566ysv9kzdb-zlib-1.3.1-dev

2026-01-25T23:23:08.601228996Z [inf]  copying path '/nix/store/wf5zj2gbib3gjqllkabxaw4dh0gzcla3-builder.pl' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.607093433Z [inf]  copying path '/nix/store/17v0ywnr3akp85pvdi56gwl99ljv95kx-gcc-14-20241116-libgcc' from 'https://cache.nixos.org'...
copying path '/nix/store/1m67ipsk39xvhyqrxnzv2m2p48pil8kl-gnu-config-2024-01-01' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.607711463Z [inf]  copying path '/nix/store/acfkqzj5qrqs88a4a6ixnybbjxja663d-xgcc-14-20241116-libgcc' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.608059181Z [inf]  copying path '/nix/store/xcqcgqazykf6s7fsn08k0blnh0wisdcl-libunistring-1.3' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.612094221Z [inf]  copying path '/nix/store/pc74azbkr19rkd5bjalq2xwx86cj3cga-linux-headers-6.12' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.612105223Z [inf]  copying path '/nix/store/fv7gpnvg922frkh81w5hkdhpz0nw3iiz-mirrors-list' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.612787275Z [inf]  copying path '/nix/store/agvks3qmzja0yj54szi3vja6vx3cwkkw-curl-8.11.0-man' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.613543287Z [inf]  copying path '/nix/store/grixvx878884hy8x3xs0c0s1i00j632k-nghttp2-1.64.0' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.616742455Z [inf]  copying path '/nix/store/d29r1bdmlvwmj52apgcdxfl1mm9c5782-update-autotools-gnu-config-scripts-hook' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.866980346Z [inf]  copying path '/nix/store/34z2792zyd4ayl5186vx0s98ckdaccz9-libidn2-2.3.7' from 'https://cache.nixos.org'...

2026-01-25T23:23:08.960003594Z [inf]  copying path '/nix/store/65h17wjrrlsj2rj540igylrx7fqcd6vq-glibc-2.40-36' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655139695Z [inf]  copying path '/nix/store/a9jgnlhkjkxav6qrc3rzg2q84pkl2wvr-attr-2.5.2' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655185242Z [inf]  copying path '/nix/store/5mh7kaj2fyv8mk4sfq1brwxgc02884wi-bash-5.2p37' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655193632Z [inf]  copying path '/nix/store/ivl2v8rgg7qh1jkj5pwpqycax3rc2hnl-bzip2-1.0.8' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655230901Z [inf]  copying path '/nix/store/74h4z8k82pmp24xryflv4lxkz8jlpqqd-ed-1.20.2' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.65524688Z [inf]  copying path '/nix/store/bpq1s72cw9qb2fs8mnmlw6hn2c7iy0ss-gcc-14-20241116-lib' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655280391Z [inf]  copying path '/nix/store/qbry6090vlr9ar33kdmmbq2p5apzbga8-expand-response-params' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655324585Z [inf]  copying path '/nix/store/a3c47r5z1q2c4rz0kvq8hlilkhx2s718-gawk-5.3.1' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655385587Z [inf]  copying path '/nix/store/fp6cjl1zcmm6mawsnrb5yak1wkz2ma8l-gnumake-4.4.1' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655418741Z [inf]  copying path '/nix/store/kryrg7ds05iwcmy81amavk8w13y4lxbs-gmp-6.3.0' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655501453Z [inf]  copying path '/nix/store/2wh1gqyzf5xsvxpdz2k0bxiz583wwq29-keyutils-1.6.3-lib' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655544581Z [inf]  copying path '/nix/store/r9ac2hwnmb0nxwsrvr6gi9wsqf2whfqj-libuv-1.49.2' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655549381Z [inf]  copying path '/nix/store/6cr0spsvymmrp1hj5n0kbaxw55w1lqyp-libxcrypt-4.4.36' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655584707Z [inf]  copying path '/nix/store/qcghigzrz56vczwlzg9c02vbs6zr9jkz-nghttp2-1.64.0-lib' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655623001Z [inf]  copying path '/nix/store/1c6bmxrrhm8bd26ai2rjqld2yyjrxhds-glibc-2.40-36-bin' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655680539Z [inf]  copying path '/nix/store/9l9n7a0v4aibcz0sgd0crs209an9p7dz-openssl-3.3.2' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.655895185Z [inf]  copying path '/nix/store/abm77lnrkrkb58z6xp1qwjcr1xgkcfwm-gnused-4.9' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.688233462Z [inf]  copying path '/nix/store/h1ydpxkw9qhjdxjpic1pdc2nirggyy6f-openssl-3.3.2' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.689375017Z [inf]  copying path '/nix/store/mglixp03lsp0w986svwdvm7vcy17rdax-bzip2-1.0.8-bin' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.690329189Z [inf]  copying path '/nix/store/cf7gkacyxmm66lwl5nj6j6yykbrg4q5c-acl-2.3.2' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.693170025Z [inf]  copying path '/nix/store/5yja5dpk2qw1v5mbfbl2d7klcdfrh90w-patch-2.7.6' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.696640689Z [inf]  copying path '/nix/store/3j1p598fivxs69wx3a657ysv3rw8k06l-pcre2-10.44' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.698779134Z [inf]  copying path '/nix/store/c2njy6bv84kw1i4bjf5k5gn7gz8hn57n-xz-5.6.3' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.698845476Z [inf]  copying path '/nix/store/cqlaa2xf6lslnizyj9xqa8j0ii1yqw0x-zlib-1.3.1' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.701165467Z [inf]  copying path '/nix/store/dz97fw51rm5bl9kz1vg0haj1j1a7r1mr-nghttp2-1.64.0-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.703479857Z [inf]  copying path '/nix/store/9cwwj1c9csmc85l2cqzs3h9hbf1vwl6c-gnutar-1.35' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.705416705Z [inf]  copying path '/nix/store/ll14czvpxglf6nnwmmrmygplm830fvlv-libuv-1.49.2-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.712235375Z [inf]  copying path '/nix/store/df2a8k58k00f2dh2x930dg6xs6g6mliv-binutils-2.43.1-lib' from 'https://cache.nixos.org'...
copying path '/nix/store/c4rj90r2m89rxs64hmm857mipwjhig5d-file-5.46' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.714466083Z [inf]  copying path '/nix/store/1lggwqzapn5mn49l9zy4h566ysv9kzdb-zlib-1.3.1-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.71979437Z [inf]  copying path '/nix/store/xmbv8s4p4i4dbxgkgdrdfb0ym25wh6gk-isl-0.20' from 'https://cache.nixos.org'...
copying path '/nix/store/qs22aazzrdd4dnjf9vffl0n31hvls43h-mpfr-4.2.1' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.724786359Z [inf]  copying path '/nix/store/h18s640fnhhj2qdh5vivcfbxvz377srg-xz-5.6.3-bin' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.743674255Z [inf]  copying path '/nix/store/nvvj6sk0k6px48436drlblf4gafgbvzr-gzip-1.13' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.744489102Z [inf]  copying path '/nix/store/aap6cq56amx4mzbyxp2wpgsf1kqjcr1f-gnugrep-3.11' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.752643401Z [inf]  copying path '/nix/store/kj8hbqx4ds9qm9mq7hyikxyfwwg13kzj-glibc-2.40-36-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.754598656Z [inf]  copying path '/nix/store/2a3anh8vl3fcgk0fvaravlimrqawawza-libmpc-1.3.1' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.842951012Z [inf]  copying path '/nix/store/j7p46r8v9gcpbxx89pbqlh61zhd33gzv-binutils-2.43.1' from 'https://cache.nixos.org'...
copying path '/nix/store/l89iqc7am6i60y8vk507zwrzxf0wcd3v-gcc-14-20241116' from 'https://cache.nixos.org'...
copying path '/nix/store/a2byxfv4lc8f2g5xfzw8cz5q8k05wi29-gmp-with-cxx-6.3.0' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.842969219Z [inf]  copying path '/nix/store/wwipgdqb4p2fr46kmw9c5wlk799kbl68-icu4c-74.2' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.843012367Z [inf]  copying path '/nix/store/srfxqk119fijwnprgsqvn68ys9kiw0bn-patchelf-0.15.0' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.847135462Z [inf]  copying path '/nix/store/v9c1s50x7magpiqgycxxkn36avzbcg0g-krb5-1.21.3-lib' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.847146884Z [inf]  copying path '/nix/store/8675pnfr4fqnwv4pzjl67hdwls4q13aa-libssh2-1.11.1' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.847204855Z [inf]  copying path '/nix/store/qq5q0alyzywdazhmybi7m69akz0ppk05-openssl-3.3.2-bin' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.864985313Z [inf]  copying path '/nix/store/4s9rah4cwaxflicsk5cndnknqlk9n4p3-coreutils-9.5' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.866875698Z [inf]  copying path '/nix/store/lygl27c44xv73kx1spskcgvzwq7z337c-openssl-3.3.2-bin' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.886468615Z [inf]  copying path '/nix/store/kqm7wpqkzc4bwjlzqizcbz0mgkj06a9x-openssl-3.3.2-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.895082286Z [inf]  copying path '/nix/store/pp2zf8bdgyz60ds8vcshk2603gcjgp72-openssl-3.3.2-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.911552424Z [inf]  copying path '/nix/store/00g69vw7c9lycy63h45ximy0wmzqx5y6-diffutils-3.10' from 'https://cache.nixos.org'...
copying path '/nix/store/jqrz1vq5nz4lnv9pqzydj0ir58wbjfy1-findutils-4.10.0' from 'https://cache.nixos.org'...
copying path '/nix/store/1i003ijlh9i0mzp6alqby5hg3090pjdx-perl-5.40.0' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.915139058Z [inf]  copying path '/nix/store/pkc7mb4a4qvyz73srkqh4mwl70w98dsv-curl-8.11.0' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.915148963Z [inf]  copying path '/nix/store/milph81dilrh96isyivh5n50agpx39k2-krb5-1.21.3' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.929008444Z [inf]  copying path '/nix/store/d7zhcrcc7q3yfbm3qkqpgc3daq82spwi-libssh2-1.11.1-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.947269439Z [inf]  copying path '/nix/store/p123cq20klajcl9hj8jnkjip5nw6awhz-curl-8.11.0-bin' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.953891258Z [inf]  copying path '/nix/store/b56mswksrql15knpb1bnhv3ysif340kd-krb5-1.21.3-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:09.95920304Z [inf]  copying path '/nix/store/4ig84cyqi6qy4n0sanrbzsw1ixa497jx-stdenv-linux' from 'https://cache.nixos.org'...

2026-01-25T23:23:10.009031814Z [inf]  building '/nix/store/1f4a312hz9m6y1ssip52drgkim8az4d6-libraries.drv'...

2026-01-25T23:23:10.010832441Z [inf]  copying path '/nix/store/5f5linrxzhhb3mrclkwdpm9bd8ygldna-curl-8.11.0-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:10.078954494Z [inf]  building '/nix/store/6vy68gykpxfphbmmyd59ya88xvrwvvaa-npm-9.9.4.tgz.drv'...

2026-01-25T23:23:10.209364117Z [inf]  building '/nix/store/79g4v87v1cgrx5vlwzcagcs6v8ps8fk2-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env.drv'...

2026-01-25T23:23:10.294038251Z [inf]  
trying https://registry.npmjs.org/npm/-/npm-9.9.4.tgz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed

2026-01-25T23:23:10.404336278Z [inf]  copying path '/nix/store/srcmmqi8kxjfygd0hyy42c8hv6cws83b-binutils-wrapper-2.43.1' from 'https://cache.nixos.org'...

2026-01-25T23:23:10.406002566Z [inf]  100 2648k  100 2648k    0     0  22.6M      0 --:--:-- --:--:-- --:--:-- 22.6M

2026-01-25T23:23:10.656252132Z [inf]  copying path '/nix/store/m8w3mf0i4862q22bxad0wspkgdy4jnkk-icu4c-74.2-dev' from 'https://cache.nixos.org'...

2026-01-25T23:23:10.749238979Z [inf]  copying path '/nix/store/j7dx1n6m5axf9r2bvly580x2ixx546wq-nodejs-20.18.1' from 'https://cache.nixos.org'...

2026-01-25T23:23:14.16736713Z [inf]  copying path '/nix/store/xcn9p4xxfbvlkpah7pwchpav4ab9d135-gcc-wrapper-14-20241116' from 'https://cache.nixos.org'...

2026-01-25T23:23:14.180035656Z [inf]  copying path '/nix/store/d0gfdcag8bxzvg7ww4s7px4lf8sxisyx-stdenv-linux' from 'https://cache.nixos.org'...

2026-01-25T23:23:14.238725993Z [inf]  building '/nix/store/w9h0z1lhfwxc0m38f3w5brfdqrzm4wyj-npm.drv'...

2026-01-25T23:23:14.293727355Z [inf]  Running phase: unpackPhase

2026-01-25T23:23:14.298602924Z [inf]  unpacking source archive /nix/store/fkd1ma3nify8r9wp463yg5rqz9hdcyf1-npm-9.9.4.tgz

2026-01-25T23:23:14.396227548Z [inf]  source root is package

2026-01-25T23:23:14.436590168Z [inf]  setting SOURCE_DATE_EPOCH to timestamp 499162500 of file package/package.json

2026-01-25T23:23:14.44139129Z [inf]  Running phase: installPhase

2026-01-25T23:23:15.019287958Z [inf]  building '/nix/store/j35hwrlsfar9sl236alrb60mcvhxqyp7-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7-env.drv'...

2026-01-25T23:23:15.114464118Z [inf]  created 33 symlinks in user environment

2026-01-25T23:23:15.218296747Z [inf]  building '/nix/store/v021qhh1c1k8bgpkfyw67ms57h3ah1pm-user-environment.drv'...

2026-01-25T23:23:15.384621138Z [inf]  removing old generations of profile /nix/var/nix/profiles/per-user/root/channels

2026-01-25T23:23:15.384774169Z [inf]  removing old generations of profile /nix/var/nix/profiles/per-user/root/profile

2026-01-25T23:23:15.384857415Z [inf]  removing profile version 1

2026-01-25T23:23:15.38500456Z [inf]  removing old generations of profile /nix/var/nix/profiles/per-user/root/channels

2026-01-25T23:23:15.385112244Z [inf]  removing old generations of profile /nix/var/nix/profiles/per-user/root/profile

2026-01-25T23:23:15.388060749Z [inf]  finding garbage collector roots...

2026-01-25T23:23:15.388160731Z [inf]  removing stale link from '/nix/var/nix/gcroots/auto/lzjbmb2ry0z7lma2fvpqprb12921pnb5' to '/nix/var/nix/profiles/per-user/root/profile-1-link'

2026-01-25T23:23:15.394095698Z [inf]  deleting garbage...

2026-01-25T23:23:15.397564159Z [inf]  deleting '/nix/store/a9qf4wwhympzs35ncp80r185j6a21w07-user-environment'

2026-01-25T23:23:15.398518818Z [inf]  deleting '/nix/store/253kwn1730vnay87xkjgxa2v97w3y079-user-environment.drv'

2026-01-25T23:23:15.399878316Z [inf]  deleting '/nix/store/hn5mrh362n52x8wwab9s1v6bgn4n5c94-env-manifest.nix'

2026-01-25T23:23:15.421765872Z [inf]  deleting '/nix/store/5f5linrxzhhb3mrclkwdpm9bd8ygldna-curl-8.11.0-dev'

2026-01-25T23:23:15.422359027Z [inf]  deleting '/nix/store/p123cq20klajcl9hj8jnkjip5nw6awhz-curl-8.11.0-bin'

2026-01-25T23:23:15.423116913Z [inf]  deleting '/nix/store/pkc7mb4a4qvyz73srkqh4mwl70w98dsv-curl-8.11.0'

2026-01-25T23:23:15.423381083Z [inf]  deleting '/nix/store/d7zhcrcc7q3yfbm3qkqpgc3daq82spwi-libssh2-1.11.1-dev'

2026-01-25T23:23:15.423719687Z [inf]  deleting '/nix/store/kqm7wpqkzc4bwjlzqizcbz0mgkj06a9x-openssl-3.3.2-dev'

2026-01-25T23:23:15.425621799Z [inf]  deleting '/nix/store/qq5q0alyzywdazhmybi7m69akz0ppk05-openssl-3.3.2-bin'

2026-01-25T23:23:15.425850187Z [inf]  deleting '/nix/store/b56mswksrql15knpb1bnhv3ysif340kd-krb5-1.21.3-dev'

2026-01-25T23:23:15.426833227Z [inf]  deleting '/nix/store/milph81dilrh96isyivh5n50agpx39k2-krb5-1.21.3'

2026-01-25T23:23:15.427929029Z [inf]  deleting '/nix/store/v9c1s50x7magpiqgycxxkn36avzbcg0g-krb5-1.21.3-lib'

2026-01-25T23:23:15.429255617Z [inf]  deleting '/nix/store/8675pnfr4fqnwv4pzjl67hdwls4q13aa-libssh2-1.11.1'

2026-01-25T23:23:15.42947649Z [inf]  deleting '/nix/store/9l9n7a0v4aibcz0sgd0crs209an9p7dz-openssl-3.3.2'

2026-01-25T23:23:15.430042541Z [inf]  deleting '/nix/store/w03v94xpvkni794qvd12x2l76gyhm9wv-source'

2026-01-25T23:23:15.430957247Z [inf]  deleting '/nix/store/fkd1ma3nify8r9wp463yg5rqz9hdcyf1-npm-9.9.4.tgz'

2026-01-25T23:23:15.431234512Z [inf]  deleting '/nix/store/dz97fw51rm5bl9kz1vg0haj1j1a7r1mr-nghttp2-1.64.0-dev'

2026-01-25T23:23:15.431536414Z [inf]  deleting '/nix/store/grixvx878884hy8x3xs0c0s1i00j632k-nghttp2-1.64.0'

2026-01-25T23:23:15.431711907Z [inf]  deleting '/nix/store/fv7gpnvg922frkh81w5hkdhpz0nw3iiz-mirrors-list'

2026-01-25T23:23:15.432316645Z [inf]  deleting '/nix/store/d0gfdcag8bxzvg7ww4s7px4lf8sxisyx-stdenv-linux'

2026-01-25T23:23:15.432592598Z [inf]  deleting '/nix/store/xcn9p4xxfbvlkpah7pwchpav4ab9d135-gcc-wrapper-14-20241116'

2026-01-25T23:23:15.433635234Z [inf]  deleting '/nix/store/srcmmqi8kxjfygd0hyy42c8hv6cws83b-binutils-wrapper-2.43.1'

2026-01-25T23:23:15.434170841Z [inf]  deleting '/nix/store/agvks3qmzja0yj54szi3vja6vx3cwkkw-curl-8.11.0-man'

2026-01-25T23:23:15.434849864Z [inf]  deleting '/nix/store/4ig84cyqi6qy4n0sanrbzsw1ixa497jx-stdenv-linux'

2026-01-25T23:23:15.435057288Z [inf]  deleting '/nix/store/fp6cjl1zcmm6mawsnrb5yak1wkz2ma8l-gnumake-4.4.1'

2026-01-25T23:23:15.437367182Z [inf]  deleting '/nix/store/j7p46r8v9gcpbxx89pbqlh61zhd33gzv-binutils-2.43.1'

2026-01-25T23:23:15.442316661Z [inf]  deleting '/nix/store/mglixp03lsp0w986svwdvm7vcy17rdax-bzip2-1.0.8-bin'

2026-01-25T23:23:15.442687769Z [inf]  deleting '/nix/store/ivl2v8rgg7qh1jkj5pwpqycax3rc2hnl-bzip2-1.0.8'

2026-01-25T23:23:15.443195047Z [inf]  deleting '/nix/store/l89iqc7am6i60y8vk507zwrzxf0wcd3v-gcc-14-20241116'

2026-01-25T23:23:15.463755455Z [inf]  deleting '/nix/store/kj8hbqx4ds9qm9mq7hyikxyfwwg13kzj-glibc-2.40-36-dev'

2026-01-25T23:23:15.469528563Z [inf]  deleting '/nix/store/1c6bmxrrhm8bd26ai2rjqld2yyjrxhds-glibc-2.40-36-bin'

2026-01-25T23:23:15.469985961Z [inf]  deleting '/nix/store/h18s640fnhhj2qdh5vivcfbxvz377srg-xz-5.6.3-bin'

2026-01-25T23:23:15.470308532Z [inf]  deleting '/nix/store/c2njy6bv84kw1i4bjf5k5gn7gz8hn57n-xz-5.6.3'

2026-01-25T23:23:15.471722651Z [inf]  deleting '/nix/store/2wh1gqyzf5xsvxpdz2k0bxiz583wwq29-keyutils-1.6.3-lib'

2026-01-25T23:23:15.471930512Z [inf]  deleting '/nix/store/aap6cq56amx4mzbyxp2wpgsf1kqjcr1f-gnugrep-3.11'

2026-01-25T23:23:15.474159564Z [inf]  deleting '/nix/store/3j1p598fivxs69wx3a657ysv3rw8k06l-pcre2-10.44'

2026-01-25T23:23:15.474480391Z [inf]  deleting '/nix/store/d29r1bdmlvwmj52apgcdxfl1mm9c5782-update-autotools-gnu-config-scripts-hook'

2026-01-25T23:23:15.474792486Z [inf]  deleting '/nix/store/abm77lnrkrkb58z6xp1qwjcr1xgkcfwm-gnused-4.9'

2026-01-25T23:23:15.477223376Z [inf]  deleting '/nix/store/df2a8k58k00f2dh2x930dg6xs6g6mliv-binutils-2.43.1-lib'

2026-01-25T23:23:15.478035221Z [inf]  deleting '/nix/store/a3c47r5z1q2c4rz0kvq8hlilkhx2s718-gawk-5.3.1'

2026-01-25T23:23:15.479672237Z [inf]  deleting '/nix/store/xmbv8s4p4i4dbxgkgdrdfb0ym25wh6gk-isl-0.20'

2026-01-25T23:23:15.480343766Z [inf]  deleting '/nix/store/wf5zj2gbib3gjqllkabxaw4dh0gzcla3-builder.pl'

2026-01-25T23:23:15.480545841Z [inf]  deleting '/nix/store/nvvj6sk0k6px48436drlblf4gafgbvzr-gzip-1.13'

2026-01-25T23:23:15.480844478Z [inf]  deleting '/nix/store/1m67ipsk39xvhyqrxnzv2m2p48pil8kl-gnu-config-2024-01-01'

2026-01-25T23:23:15.480974721Z [inf]  deleting '/nix/store/qcghigzrz56vczwlzg9c02vbs6zr9jkz-nghttp2-1.64.0-lib'

2026-01-25T23:23:15.481292091Z [inf]  deleting '/nix/store/2a3anh8vl3fcgk0fvaravlimrqawawza-libmpc-1.3.1'

2026-01-25T23:23:15.481535105Z [inf]  deleting '/nix/store/qs22aazzrdd4dnjf9vffl0n31hvls43h-mpfr-4.2.1'

2026-01-25T23:23:15.481682112Z [inf]  deleting '/nix/store/kryrg7ds05iwcmy81amavk8w13y4lxbs-gmp-6.3.0'

2026-01-25T23:23:15.481944119Z [inf]  deleting '/nix/store/1i003ijlh9i0mzp6alqby5hg3090pjdx-perl-5.40.0'

2026-01-25T23:23:15.504974025Z [inf]  deleting '/nix/store/6cr0spsvymmrp1hj5n0kbaxw55w1lqyp-libxcrypt-4.4.36'
deleting '/nix/store/jqrz1vq5nz4lnv9pqzydj0ir58wbjfy1-findutils-4.10.0'

2026-01-25T23:23:15.507152948Z [inf]  deleting '/nix/store/9fxr7753z31rn59i64dqaajgsx0ap91p-libraries'

2026-01-25T23:23:15.507367604Z [inf]  deleting '/nix/store/5yja5dpk2qw1v5mbfbl2d7klcdfrh90w-patch-2.7.6'

2026-01-25T23:23:15.507835994Z [inf]  deleting '/nix/store/9cwwj1c9csmc85l2cqzs3h9hbf1vwl6c-gnutar-1.35'

2026-01-25T23:23:15.510239347Z [inf]  deleting '/nix/store/c4rj90r2m89rxs64hmm857mipwjhig5d-file-5.46'

2026-01-25T23:23:15.510825854Z [inf]  deleting '/nix/store/pc74azbkr19rkd5bjalq2xwx86cj3cga-linux-headers-6.12'

2026-01-25T23:23:15.520179646Z [inf]  deleting '/nix/store/00g69vw7c9lycy63h45ximy0wmzqx5y6-diffutils-3.10'

2026-01-25T23:23:15.522475721Z [inf]  deleting '/nix/store/qbry6090vlr9ar33kdmmbq2p5apzbga8-expand-response-params'

2026-01-25T23:23:15.522687543Z [inf]  deleting '/nix/store/74h4z8k82pmp24xryflv4lxkz8jlpqqd-ed-1.20.2'

2026-01-25T23:23:15.52298605Z [inf]  deleting '/nix/store/srfxqk119fijwnprgsqvn68ys9kiw0bn-patchelf-0.15.0'

2026-01-25T23:23:15.52338881Z [inf]  deleting '/nix/store/lwi59jcfwk2lnrakmm1y5vw85hj3n1bi-source'

2026-01-25T23:23:16.533298872Z [inf]  deleting unused links...

2026-01-25T23:23:18.074937652Z [inf]  note: currently hard linking saves 1.72 MiB

2026-01-25T23:23:18.08274289Z [inf]  61 store paths deleted, 559.41 MiB freed

2026-01-25T23:23:18.317537912Z [inf]  [stage-0  4/10] RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix && nix-collect-garbage -d
2026-01-25T23:23:18.319952208Z [inf]  [stage-0  5/10] COPY . /app/.
2026-01-25T23:23:18.432673231Z [inf]  [stage-0  5/10] COPY . /app/.
2026-01-25T23:23:18.434414910Z [inf]  [stage-0  6/10] RUN --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-/root/npm,target=/root/.npm npm ci
2026-01-25T23:23:18.613766219Z [inf]  npm warn config production Use `--omit=dev` instead.

2026-01-25T23:23:19.063000941Z [inf]  npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'pg-boss@12.6.0',
npm warn EBADENGINE   required: { node: '>=22.12.0' },
npm warn EBADENGINE   current: { node: 'v20.18.1', npm: '10.8.2' }
npm warn EBADENGINE }

2026-01-25T23:23:30.457363067Z [inf]  
added 492 packages, and audited 493 packages in 12s

2026-01-25T23:23:30.457406643Z [inf]  

2026-01-25T23:23:30.457414471Z [inf]  156 packages are looking for funding
  run `npm fund` for details

2026-01-25T23:23:30.458743822Z [inf]  
found 0 vulnerabilities

2026-01-25T23:23:31.290754458Z [inf]  [stage-0  6/10] RUN --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-/root/npm,target=/root/.npm npm ci
2026-01-25T23:23:31.293379751Z [inf]  [stage-0  7/10] COPY . /app/.
2026-01-25T23:23:31.512708900Z [inf]  [stage-0  7/10] COPY . /app/.
2026-01-25T23:23:31.514358292Z [inf]  [stage-0  8/10] RUN --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-next/cache,target=/app/.next/cache --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-01-25T23:23:31.716545761Z [inf]  npm warn config production Use `--omit=dev` instead.

2026-01-25T23:23:31.729969391Z [inf]  
> plebtest@0.1.0 build
> next build


2026-01-25T23:23:32.469764634Z [inf]  Attention: Next.js now collects completely anonymous telemetry regarding usage.

2026-01-25T23:23:32.470127402Z [inf]  This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:

2026-01-25T23:23:32.470135944Z [inf]  https://nextjs.org/telemetry

2026-01-25T23:23:32.470175157Z [inf]  

2026-01-25T23:23:32.483915623Z [inf]  ▲ Next.js 16.1.4 (Turbopack)

2026-01-25T23:23:32.484009273Z [inf]  

2026-01-25T23:23:32.486525507Z [inf]  ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

2026-01-25T23:23:32.553636459Z [inf]    Creating an optimized production build ...

2026-01-25T23:23:36.11024721Z [inf]  

2026-01-25T23:23:36.110263875Z [inf]  > Build error occurred

2026-01-25T23:23:36.11603971Z [inf]  Error: Turbopack build failed with 1 errors:
./src/components/ui/progress.tsx:4:1
Module not found: Can't resolve '@radix-ui/react-progress'
[0m [90m 2 |[39m
 [90m 3 |[39m [36mimport[39m [33m*[39m [36mas[39m [33mReact[39m [36mfrom[39m [32m"react"[39m
[31m[1m>[22m[39m[90m 4 |[39m [36mimport[39m [33m*[39m [36mas[39m [33mProgressPrimitive[39m [36mfrom[39m [32m"@radix-ui/react-progress"[39m
 [90m   |[39m [31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m[31m[1m^[22m[39m
 [90m 5 |[39m
 [90m 6 |[39m [36mimport[39m { cn } [36mfrom[39m [32m"@/lib/utils"[39m
 [90m 7 |[39m[0m



Import trace:
  Server Component:
    ./src/components/ui/progress.tsx
    ./src/app/(protected)/ideas/[ideaId]/proposals/[proposalId]/tests/[testId]/page.tsx

https://nextjs.org/docs/messages/module-not-found


    at <unknown> (./src/components/ui/progress.tsx:4:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)

2026-01-25T23:23:36.785894287Z [err]  [stage-0  8/10] RUN --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-next/cache,target=/app/.next/cache --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-01-25T23:23:36.804850179Z [err]  Dockerfile:24
2026-01-25T23:23:36.804886278Z [err]  -------------------
2026-01-25T23:23:36.804891110Z [err]  22 |     # build phase
2026-01-25T23:23:36.804895439Z [err]  23 |     COPY . /app/.
2026-01-25T23:23:36.804901239Z [err]  24 | >>> RUN --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-next/cache,target=/app/.next/cache --mount=type=cache,id=s/711e8921-b277-4895-b324-9d735b7c79d2-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-01-25T23:23:36.804904972Z [err]  25 |
2026-01-25T23:23:36.804908651Z [err]  26 |
2026-01-25T23:23:36.804913060Z [err]  -------------------
2026-01-25T23:23:36.804919975Z [err]  ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c npm run build" did not complete successfully: exit code: 1
2026-01-25T23:23:36.810681641Z [err]  Error: Docker build failed
