import { useCallback, useEffect, useRef } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useUIStore } from '@/shared/stores/uiStore'
import { Colors, Radius } from '@/shared/constants/tokens'
import { InfoSheetContent } from './InfoSheetContent'

export const InfoSheet = () => {
  const sheetRef       = useRef<BottomSheet>(null)
  const isOpen         = useUIStore((s) => s.isInfoSheetOpen)
  const closeInfoSheet = useUIStore((s) => s.closeInfoSheet)

  useEffect(() => {
    if (isOpen) sheetRef.current?.expand()
    else sheetRef.current?.close()
  }, [isOpen])

  const handleChange = useCallback(
    (index: number) => {
      if (index === -1 && isOpen) closeInfoSheet()
    },
    [isOpen, closeInfoSheet],
  )

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      enableDynamicSizing
      enablePanDownToClose
      onChange={handleChange}
      backgroundStyle={{
        backgroundColor:      Colors.sand,
        borderTopLeftRadius:  Radius.xl,
        borderTopRightRadius: Radius.xl,
      }}
      handleIndicatorStyle={{ backgroundColor: Colors.stone }}
    >
      <BottomSheetView>
        <InfoSheetContent isOpen={isOpen} />
      </BottomSheetView>
    </BottomSheet>
  )
}
