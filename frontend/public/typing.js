const str = 'in one good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so face order school good not most run problem group run she late other problem real form what just high no man do under would to each too end point give number child through so this large see get form also all those course to work during about he plan still so like down he look down where course at who plan way so since come against he all who at world because while so few last these mean take house who old way large no first too now off would in this course present order home public school back own little about he develop of do over help day house stand present another by few come that down last or use say take would each even govern play around back under some line think she even when from do real problem between long as there school do as mean to all on other good may from might call world thing life turn of he look last problem after get show want need thing old other during be again develop come from consider the now number say life interest to system only group world same state school one problem between for turn run at very against eye must go both still all a as so after play eye little be those should out after which these both much house become both school this he real and may mean time by real number other as feel at end ask plan come turn by all head increase he present increase use stand after see order lead than system here ask in of look point little too without each for both but right we come world much own set we right off long those stand go both but under now must real general then before with much those at no of we only back these person plan from run new as own take early just increase only look open follow get that on system the mean plan man over it possible if most late line would first without real hand say turn point small set at in system however to be home show new again come under because about show face child know person large program how over could thing from out world while nation stand part run have look what many system order some one program you great could write day do he any also where child late face eye run still again on by as call high the must by late little mean never another seem to leave because for day against public long number word about after much need open change also';
const edu3 = 'zebras are not exactly known for being quiet animals. she/he would very likely just play along for a while. you can make quite a lot of lemon zest with even larger sized lemons; please cover each plate. six foxes quickly woke axel; just in time. i caught five jelly fish, six octopus and two sea urchins for my buddy ben. eight / six is exactly equal to four / three.'
const edu2 ='the four lads stood quietly atop the tower; pear salad is a great quirky dish; plaid dads play golf; slide the glass to your good pal; we gladly yapped for two hours; wade through the water to us; either of us will go; we used our gold goose eggs well; let us do tea for two; go forward to the other side; other ghosts will spook us; the riders had quite a lot of leg power; you see how easy it is to type the top row; a little further to go yet; i wish i had read the flyer fully; read it for us please; joe sipped jade tea jealously; kate flew her fast kite sky high;'
const edu1 = 'aaa aaa aaa ;;; ;;; ;;; sss sss sss lll lll lll ddd ddd ddd kkk kkk kkk fff fff fff jjj jjj jjj ggg ggg ggg hhh hhh hhh ggg hhh fff jjj ddd kkk sss lll aaa ;;; asdfghjkl; asdfghjkl; asdfghjkl; a;sldkfjgh a;sldkfjgh a;sldkfjgh ghfjdksla; ghfjdksla; ghfjdksla; asa asa ada ada afa afa aga aga aha aha aja aja aka aka ala ala a;a a;a ;l; ;l; ;k; ;k; ;j; ;j; ;h; ;h; ;g; ;g; ;f; ;f; ;d; ;d; ;s; ;s; ;a; ;a; sas sas sds sds sfs sfs sgs sgs shs shs sjs sjs sks sks sls sls s;s s;s l;l l;l lkl lkl ljl ljl lhl lhl lgl lgl lfl lfl ldl ldl lsl lsl lal lal dad dad dsd dsd dfd dfd dgd dgd dhd dhd dkd dkd dld dld d;d d;d k;k k;k klk klk kjk kjk khk khk kgk kgk kfk kfk kdk kdk ksk ksk kak kak faf faf fsf fsf fdf fdf fgf fgf fhf fhf fjf fjf fkf fkf flf flf f;f f;f j;j j;j jlj jkj jkj jhj jhj jgj jgj jfj jfj jdj jdj jsj jsj jaj jaj gag gag gsg gsg gdg gdg gfg gfg ghg ghg gkg gkg glg glg g;g g;g h;h h;h hlh hlh hkh hkh hjh hjh hgh hgh hfh hfh hdh hdh hsh hsh hah hah a l s j d h g ; f k l f s ; j g k h a d'
const homeWord = edu1.split(' ');
const topWord  = edu2.split(' ');
const botWord = edu3.split(' ');
const words = str.split(' ');
const wordsCount = words.length;
let gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;

function addClass(el, name) {
    el.classList.add(name);
}

function removeClass(el, name) {
    el.classList.remove(name);
}

function randomWord() {
    const randomIndex = Math.ceil(Math.random() * wordsCount);
    return words[randomIndex - 1];
}

function formatWord(word) {
    return `<div class = "word"><span class = "letter">${word.split('').join('</span><span class = "letter">')}</span></div>`;
}

function newGame() {
    document.getElementById('words').innerHTML = '';
    document.getElementById('info').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    document.getElementById('info').innerHTML = (gameTime / 1000);
    window.timer = null;
    removeClass(document.getElementById('game'), 'over');
    document.getElementById('words').style.marginTop = 0;
}

function getWpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord);
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect'));
        const correctLetters = letters.filter(letter => letter.classList.contains('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / gameTime * 60000;
}

function gameOver() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    const result = getWpm();
    document.getElementById('info').innerHTML = `WPM: ${result}`;
    window.gameStart = null;
}

document.getElementById('game').addEventListener('keydown', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    const firstWord = document.querySelector('#words').firstChild;
    const isExtra = currentWord.lastChild.classList.contains('extra');

    if (document.querySelector('#game.over')) {
        return;
    }

    console.log(key, expected);

    if (!window.timer && (isLetter || isSpace)) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = (gameTime / 1000) - sPassed;
            if (sLeft <= 0) {
                gameOver();
                return;
            }
            document.getElementById('info').innerHTML = sLeft;
        }, 1000);
    }

    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            if (currentWord.childElementCount < 20) {
                const incorrectLetter = document.createElement('span');
                incorrectLetter.innerHTML = key;
                incorrectLetter.className = 'letter incorrect extra';
                currentWord.appendChild(incorrectLetter);
            }
        }
    }

    if (isSpace) {
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
        const invalidWord = [...currentWord.childNodes];
        for (let i = 0; i < invalidWord.length; i++) {
            if (invalidWord[i].classList.contains('incorrect')) {
                addClass(currentWord, 'incorrect');
                break;
            }
        }
    }

    if (isBackspace) {
        if (currentLetter && isFirstLetter && currentWord !== firstWord) {
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            removeClass(currentWord.previousSibling, 'incorrect');
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
        if (isExtra) {
            currentWord.lastChild.remove();
        }
    }

    // move lines
    if (currentWord.getBoundingClientRect().top > 630) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }

    // move cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = nextWord.firstChild.getBoundingClientRect().top + 4 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

document.getElementById('newGameBtn').addEventListener('click', () => {
    gameOver();
    newGame();
    resetCursor();
});

function resetCursor() {
    cursor.style.top = document.querySelector('.letter.current').getBoundingClientRect().top + 4 + 'px';
    cursor.style.left = document.querySelector('.letter.current').getBoundingClientRect().left + 'px';
}

newGame();
resetCursor();


function homePractice() {
    document.getElementById('#homeRow').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('#homeRow').innerHTML += formatWord(homeWord[i]);
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    removeClass(document.getElementById('game'), 'over');
    document.getElementById('homeRow').style.marginTop = 0;
    console.log('home')
}

function topPractice() {
    document.getElementById('topRow').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('topRow').innerHTML += formatWord(topWord[i]);
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    removeClass(document.getElementById('game'), 'over');
    document.getElementById('topRow').style.marginTop = 0;
}

function botPractice() {
    document.getElementById('#botRow').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('botRow').innerHTML += formatWord(botWord[i]);
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    removeClass(document.getElementById('game'), 'over');
    document.getElementById('botRow').style.marginTop = 0;
}