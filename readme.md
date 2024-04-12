# s21lint

Программа для статической проверки C/C++ кода на соответствие требованиям к проектам школы 21.

## Установка

```sh
npm install --global @s21toolkit/lint
```

## Использование

```sh
s21lint program.c
s21lint foo.c bar.c
s21lint *.c
s21lint "**.c"
s21lint "src/**.c" "include/**.h"
```

## Поддерживаемые правила

- Структурное программирование
  - `s21-structural-function-line-limit`
    - Лимит количества строк в функции (50)
  - `s21-structural-indentation-limit`
    - Лимит отступа для блоков (4)
  - `s21-structural-no-global-variables`
    - Запрет использования глобальных переменных
  - `s21-structural-no-goto`
    - Запрет использования goto
  - `s21-structural-no-multiple-loop-exits`
    - Запрет нескольких выходов (break/return) в одном цикле
  - `s21-structural-no-multiple-returns`
    - Предупреждение о нескольких возвратах из функции
