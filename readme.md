# s21lint

Программа для статической проверки C/C++ кода на соответствие требованиям к проектам школы 21.

## Установка

```sh
bun add --global github:s21toolkit/s21lint
```

## Использование

```sh
s21lint program.c
s21lint foo.c bar.c
s21lint *.c
s21lint "**.c"
s21lint "src/**.c" "include/**.h"
```
