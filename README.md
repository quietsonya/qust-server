<h2>Qust - messenger<h2>

<h4>docker compose up --build to start<h4>

<h3>Stack:<h3>
<h5>NestJS - Node.js framework<h5>
<h5>Typescript<h5>
<h5>PostgreSQL - основная база данных<h5>
<h5>Redis - для хранения refresh токенов<h5>


<p>Qust - мессенджер, повторяющий многие функции популярного приложения Discord:<p>

* Списки друзей
* Статусы пользователей (онлайн/оффлайн/невидимка)
* ЛС, чаты
* Метки непрочитанных сообщений
* Группы (эквивалент серверам в Discord)
* Категории и текстовые каналы в группах
* Пользовательские роли в группах
* Гибкая настройка разрешений ролей (например, может ли пользователь писать в определённый текстовый канал или редактировать каналы/роли, может ли создавать приглашения в группу и т. д.)
* Журнал аудита группы
* Упоминания пользователей


<p>На многие действия в приложении, такие как написание сообщения в текстовый канал или обновление названия группы (группа в моём проекте - эквивалент "серверу" в Discord), генерируются соответствующие внутренние ивенты (помимо WebSocket ивентов, отправляемых клиентам). Благодаря этому модули могут удобно передавать данные между собой. Например, при изменении названия текстового канала TextChannelsService генерирует ивент об изменении и передаёт в сообщение ивента нужные данные - в данном случае объект TextChannel (в приложении используется ORM). TextChannelsGateway подхватывает ивент и передаёт новое имя канала всем пользователям, которые подключены к комнате "group:*ID группы*" (т. к. именно эти пользователи в данный момент просматривают названия каналов этой группы). Также, GroupAuditLogger подхватывает ивент и записывает в журнал аудита группы соответствующую строчку об изменении.<p>
