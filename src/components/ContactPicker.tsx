import React, { useState, useEffect } from 'react';
import { Users, Search, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Contact } from '../types';

interface ContactPickerProps {
  onSelect: (name: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export const ContactPicker: React.FC<ContactPickerProps> = ({ onSelect, initialValue = '', placeholder = 'اسم الشخص' }) => {
  const { contacts, addContact } = useApp();
  const [inputValue, setInputValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter contacts based on input
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onSelect(val);
    setShowSuggestions(true);
  };

  const selectContact = (contact: Contact) => {
    setInputValue(contact.name);
    onSelect(contact.name);
    setShowSuggestions(false);
  };

  const handleNativeContactPicker = async () => {
    // Check if running in an iframe (Security restriction for Contacts API)
    if (window.self !== window.top) {
      alert('عذراً، لا يمكن استخدام ميزة استيراد جهات الاتصال أثناء التشغيل في وضع المعاينة (Iframe). يرجى تجربة التطبيق في نافذة مستقلة.');
      return;
    }

    try {
      // TypeScript definition for navigator.contacts
      // @ts-ignore
      if ('contacts' in navigator && 'ContactsManager' in window) {
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        // @ts-ignore
        const contacts = await navigator.contacts.select(props, opts);
        
        if (contacts && contacts.length > 0) {
          const contact = contacts[0];
          const name = contact.name[0];
          const phone = contact.tel ? contact.tel[0] : undefined;
          
          setInputValue(name);
          onSelect(name);
          
          // Auto save to our local contacts if not exists
          addContact({
            id: crypto.randomUUID(),
            name: name,
            phone: phone
          });
        }
      } else {
        alert('ميزة استيراد جهات الاتصال غير مدعومة في هذا المتصفح. يرجى الكتابة يدوياً.');
      }
    } catch (ex: any) {
      console.error("Contact Picker Error:", ex);
      if (ex.name === 'SecurityError' || (ex.message && ex.message.includes('top frame'))) {
         alert('عذراً، الوصول لجهات الاتصال مقيد في هذا المتصفح لأسباب أمنية.');
      } else {
         // Silently ignore cancellation errors, alert on others
         if (ex.name !== 'AbortError') {
            alert('حدث خطأ أثناء محاولة الوصول لجهات الاتصال.');
         }
      }
    }
  };

  // Close suggestions when clicking outside (simple implementation)
  useEffect(() => {
    const handleClick = () => setTimeout(() => setShowSuggestions(false), 200);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full border p-3 pl-10 rounded-xl outline-none focus:border-primary-500"
          />
          <Users className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
        <button
          type="button"
          onClick={handleNativeContactPicker}
          className="bg-primary-50 text-primary-600 p-3 rounded-xl hover:bg-primary-100 transition"
          title="استيراد من الهاتف"
        >
          <Phone size={20} />
        </button>
      </div>

      {showSuggestions && filteredContacts.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-100 shadow-lg rounded-xl mt-1 max-h-48 overflow-y-auto">
          {filteredContacts.map(contact => (
            <button
              key={contact.id}
              type="button"
              onClick={() => selectContact(contact)}
              className="w-full text-right px-4 py-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0"
            >
              <span className="font-medium text-gray-700">{contact.name}</span>
              {contact.phone && <span className="text-xs text-gray-400">{contact.phone}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};