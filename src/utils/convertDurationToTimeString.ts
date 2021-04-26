export function convertDurationToTimeString(duration:number) {

    // Math.floor arredonda para o menor número da divisão

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    // monta o array pra retornar o horário em formato de 01:20:00
    // Cria um map em formato de String, e coloca para iniciar com 2 números acrescentando 0

    const timeString = [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0'))
        .join(':')

    return timeString;
}