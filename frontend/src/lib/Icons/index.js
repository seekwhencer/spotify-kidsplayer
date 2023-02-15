import IconMusic from "./music.html";
import IconBook from "./book.html";
import IconPodcast from "./podcast.html";
import IconEye from "./eye.html";
import IconPen from "./pen.html";
import IconHeart from "./heart.html";
import IconMouth from "./mouth.html";

const music = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconMusic({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const book = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconBook({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const podcast = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconPodcast({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}
const eye = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconEye({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const pen = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconPen({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

const heart = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconHeart({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}
const mouth = scope => {
    typeof scope === 'undefined' ? scope = {} : null;
    return IconMouth({
        scope: {
            ...scope,
            height: scope.height || 24,
            width: scope.width || 24
        }
    });
}

export {
    music as music,
    book as book,
    podcast as podcast,
    eye as eye,
    pen as pen,
    heart as heart,
    mouth as mouth

}

