const { clipboard } = require('electron');
const { ClipboardMonitor } = require('../src/clipboardMonitor');

describe('ClipboardMonitor', () => {
  test('checkForNewClipboardEntry emits copied event if clipboardText is different from last time', () => {
    const clipboard = {
      readText: jest.fn()
        .mockReturnValueOnce('First')
        .mockReturnValue('All the rest...')
    };
      
    const sut = new ClipboardMonitor(clipboard);
    const emit = jest.spyOn(sut, 'emit');

    sut.checkForNewClipboardEntry();
    expect(emit).toHaveBeenCalledWith('copied', 'First');

    sut.checkForNewClipboardEntry();
    expect(emit).toHaveBeenCalledWith('copied', 'All the rest...');

    emit.mockClear();
    sut.checkForNewClipboardEntry();
    expect(emit).not.toHaveBeenCalled();
  });
});
