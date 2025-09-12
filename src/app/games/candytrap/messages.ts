export const safeCandyMessages: string[] = [
  "¡Uf! Estaba delicioso y seguro.",
  "Por esta vez, la suerte estuvo de tu lado.",
  "Nada raro aquí, solo puro azúcar.",
  "¡Bien jugado! Este caramelo estaba limpio.",
  "Un sabor dulce… y sin veneno.",
  "Respirá tranquilo, el caramelo estaba sano.",
  "Tu instinto no falló esta vez.",
  "¡Qué alivio! No había trampa en este caramelo.",
  "Dulce victoria (al menos por ahora).",
  "La suerte sonríe a los valientes… este caramelo era seguro."
];

export const opponentSafeCandyMessages: string[] = [
  "¡Rayos! [opponent] salió ileso esta vez.",
  "El caramelo estaba limpio… mala suerte para ti, [opponent] sigue en pie.",
  "Nada de veneno, [opponent] sonríe satisfecho.",
  "Tu plan falló, [opponent] comió tranquilo.",
  "Ese dulce era seguro, y [opponent] se lo disfrutó.",
  "¡Ups! [opponent] esquivó tu trampa.",
  "Todavía no, [opponent] probó un caramelo limpio.",
  "El veneno no estaba ahí, [opponent] tuvo suerte.",
  "[opponent] probó el azúcar de la victoria.",
  "El dulce resultó inocente, y [opponent] salió contento."
];

export const loseCandyMessages: string[] = [
  "¡Uy! Has comido el caramelo envenenado.",
  "Cuidado… ese dulce tenía truco y te tocó a ti.",
  "¡Mala suerte! El caramelo te jugó una mala pasada.",
  "No fue tu día… el veneno ganó esta ronda.",
  "¡Ups! Te comiste el caramelo peligroso.",
  "El dulce parecía inocente, pero te venció.",
  "Esta vez la suerte no estuvo de tu lado.",
  "El caramelo estaba envenenado… y ahora lo sabés.",
  "Casi lo logras, pero el veneno fue más rápido.",
  "Perdiste la ronda… y el caramelo también."
];

export const opponentLoseCandyMessages: string[] = [
  "¡Ha caído [opponent]! Ese caramelo era mortal.",
  "¡Mala suerte, [opponent]! Comió el dulce envenenado.",
  "[opponent] no tuvo chance… el veneno ganó.",
  "¡Cuidado! [opponent] se llevó el caramelo peligroso.",
  "El caramelo estaba envenenado y [opponent] cayó.",
  "¡Boom! [opponent] probó el dulce trampa.",
  "El azúcar de la derrota se lo lleva [opponent].",
  "[opponent] pierde esta ronda… y el caramelo también.",
  "¡Uy! Ese dulce no era seguro para [opponent].",
  "[opponent] pensó que era inocente… pero no lo era."
];

export function getSafeCandyMessage(): string {
  const index = Math.floor(Math.random() * safeCandyMessages.length);
  return safeCandyMessages[index];
}

export function getOpponentSafeCandyMessage(username: string): string {
  const index = Math.floor(Math.random() * opponentSafeCandyMessages.length);
  return opponentSafeCandyMessages[index].replace('[opponent]', username);
}

export function getLoseCandyMessage(): string {
  const index = Math.floor(Math.random() * loseCandyMessages.length);
  return loseCandyMessages[index];
}

export function getOpponentLoseCandyMessage(username: string): string {
  const index = Math.floor(Math.random() * opponentLoseCandyMessages.length);
  return opponentLoseCandyMessages[index].replace('[opponent]', username);
}