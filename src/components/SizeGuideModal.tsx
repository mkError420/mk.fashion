import React from 'react';
import { X, Ruler } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide, sizeGuideCategory } = useShop();

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 my-auto text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-black text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <Ruler className="w-5 h-5 text-white" />
            <h3 className="font-serif font-bold text-base sm:text-lg">
              Official Garment Size Guide (সাইজ চার্ট)
            </h3>
          </div>

          <button
            type="button"
            onClick={closeSizeGuide}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Panjabi Size Chart */}
          <div>
            <h4 className="font-bold text-sm text-neutral-900 font-serif mb-2 flex items-center">
              <span>Panjabi & Kabli Dimensions (All measurements in Inches)</span>
            </h4>
            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100 text-neutral-700 uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Length</th>
                    <th className="p-2.5">Sleeve</th>
                    <th className="p-2.5">Collar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">38 (S)</td>
                    <td className="p-2.5">40"</td>
                    <td className="p-2.5">40"</td>
                    <td className="p-2.5">24.5"</td>
                    <td className="p-2.5">15"</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">40 (M)</td>
                    <td className="p-2.5">42"</td>
                    <td className="p-2.5">42"</td>
                    <td className="p-2.5">25"</td>
                    <td className="p-2.5">15.5"</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">42 (L)</td>
                    <td className="p-2.5">44"</td>
                    <td className="p-2.5">44"</td>
                    <td className="p-2.5">25.5"</td>
                    <td className="p-2.5">16"</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">44 (XL)</td>
                    <td className="p-2.5">46"</td>
                    <td className="p-2.5">45"</td>
                    <td className="p-2.5">26"</td>
                    <td className="p-2.5">16.5"</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">46 (XXL)</td>
                    <td className="p-2.5">48"</td>
                    <td className="p-2.5">46"</td>
                    <td className="p-2.5">26.5"</td>
                    <td className="p-2.5">17"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Suits & Blazers Chart */}
          <div>
            <h4 className="font-bold text-sm text-neutral-900 font-serif mb-2">
              Top Ten Mart Executive Blazers & Suits
            </h4>
            <div className="overflow-x-auto border border-neutral-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100 text-neutral-700 uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">Blazer Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Shoulder</th>
                    <th className="p-2.5">Jacket Length</th>
                    <th className="p-2.5">Sleeve Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">36R</td>
                    <td className="p-2.5">38"</td>
                    <td className="p-2.5">17.5"</td>
                    <td className="p-2.5">28.5"</td>
                    <td className="p-2.5">24.5"</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">38R</td>
                    <td className="p-2.5">40"</td>
                    <td className="p-2.5">18"</td>
                    <td className="p-2.5">29"</td>
                    <td className="p-2.5">25"</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">40R</td>
                    <td className="p-2.5">42"</td>
                    <td className="p-2.5">18.5"</td>
                    <td className="p-2.5">29.5"</td>
                    <td className="p-2.5">25.5"</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="p-2.5 font-bold text-neutral-900">42R</td>
                    <td className="p-2.5">44"</td>
                    <td className="p-2.5">19"</td>
                    <td className="p-2.5">30"</td>
                    <td className="p-2.5">26"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-neutral-100 p-3 rounded-xl text-xs text-neutral-600">
            <p>
              <strong>Bespoke Fit Guarantee:</strong> If the size ordered does not fit perfectly, we offer free size exchange within 7 days via Steadfast or Pathao courier exchange service!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
