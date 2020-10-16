"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clipboardMonitor_1 = require("../src/clipboardMonitor");
describe('ClipboardMonitor', function () {
    test('checkForNewClipboardEntry emits copied event if clipboardText is different from last time', function () {
        var clipboard = {
            readText: jest.fn()
                .mockReturnValueOnce('First')
                .mockReturnValue('All the rest...')
        };
        var sut = new clipboardMonitor_1.ClipboardMonitor(clipboard);
        var emit = jest.spyOn(sut, 'emit');
        sut.checkForNewClipboardEntry();
        expect(emit).toHaveBeenCalledWith('copied', 'First');
        sut.checkForNewClipboardEntry();
        expect(emit).toHaveBeenCalledWith('copied', 'All the rest...');
        emit.mockClear();
        sut.checkForNewClipboardEntry();
        expect(emit).not.toHaveBeenCalled();
    });
});
