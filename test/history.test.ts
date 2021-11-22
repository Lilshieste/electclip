import { History } from '../src/history';

describe('History', () => {
    it('should not record something that might be a password', () => {
        const sut = new History();

        expect(sut.addItem('Asdf123!')).toBe(false);
        expect(sut.addItem('asdf123!')).toBe(false);
        expect(sut.addItem('ActualWordsWithANumberLike1?')).toBe(false);

        expect(sut.addItem('ActualWordsWithoutANumber?')).toBe(true);
        expect(sut.addItem('Not if there are any spaces!')).toBe(true);
        expect(sut.addItem('len<6')).toBe(true);
    });
});