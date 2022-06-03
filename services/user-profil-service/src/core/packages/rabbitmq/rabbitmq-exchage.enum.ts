export enum RabbitMQExchangeType
{
    MESSAGE_TO_ALL="fanout",
    MESSAGE_TO_ONE="direct",
    MESSAGE_TO_MANY_REDIRECT_BY_REGEX="topic",
    MESSAGE_TO_MANY_REDIRECT_BY_HEADERS="headers"
}