# Desafio Backend CUBOS

## Requerimentos

- Npm package
- NodeJS

## Começando

- Fork este repositório.
- Clone este repositório.

Para iniciar o projeto use os seguintes comandos no seu terminal:

```
# Vá até a pasta CHALLENGE_CUBOS
$ cd CHALLENGE_CUBOS
# Instale as dependências
$ npm install
$ npm start

```

## Endpoints

# Cadastro de regra de atendimento.

Método **POST**
localhost:3000/regras 

- [] exemplo para um dia específico

```json
{
    "specificDay": "10/05/2019",
    "daily": false,
    "weekly": false,
    "daysWeek": [],
    "intervals": [
        { "start": "8:00", "end": "09:30" },
        { "start": "09:40", "end": "10:00" },
    ]
}
```

- [] exemplo para atendimento diário

```json
{
    "specificDay": false,
    "daily": true,
    "weekly": false,
    "daysWeek": [],
    "intervals": [
        { "start": "9:00", "end": "09:50" },
        { "start": "10:00", "end": "12:00" },
    ]
}
```

- [] exemplo para atendimento em dias específicos

```json
{
    "specificDay": false,
    "daily": false,
    "weekly": true,
    "daysWeek": [
        {"day": false },
        {"day": "monday"},
        {"day": "tuesday"},
        {"day": "wednesday"},
        {"day": false},
        {"day": false},
        {"day": false}
    ],
    "intervals": [
        { "start": "08:00", "end": "11:50" },
    ]
}
```
- [ ] Os dados são validados, para cadastrar apenas uma regra **Dia específico || Diário || Semanal** 

- [ ] Os intervalos são validados para que o início do próximo período não seja menor que o fim do período anterior

# Apagar regra

Altere o método para **DELETE**
localhost:3000/regras 

- [] exemplo

```json
{
    "specificDay": false,
    "daily": true,
    "weekly": false,
    "daysWeek": [],
    "intervals": [
        { "start": "9:00", "end": "09:50" },
        { "start": "10:00", "end": "12:00" },
    ]
}
```
# Listar regras

Altere o método para **GET**
localhost:3000/regras 

Retornar o todos as regras criadas.

# Horários disponíveis

Altere o método para **GET**
http://localhost:3000/rules/interval?start=02-05-2019&end=05-05-2019

Retorna os horários disponíveis, baseado nas regras criadas anteriormente, considerando o intervalo de datas informadas na requisição.

:smiley:
